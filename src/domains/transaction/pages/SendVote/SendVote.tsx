import { Services } from "@arkecosystem/platform-sdk";
import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { StepNavigation } from "app/components/StepNavigation";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext, useLedgerContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useQueryParams, useValidation } from "app/hooks";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import { ErrorStep } from "domains/transaction/components/ErrorStep";
import { FeeWarning } from "domains/transaction/components/FeeWarning";
import { useFeeConfirmation, useTransactionBuilder, useWalletSignatory } from "domains/transaction/hooks";
import { handleBroadcastError, isMnemonicError } from "domains/transaction/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FormStep, ReviewStep, SummaryStep } from ".";
import { VoteLedgerReview } from "./LedgerReview";

export const SendVote = () => {
	const { t } = useTranslation();
	const { env, persist } = useEnvironmentContext();
	const history = useHistory();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const networks = useMemo(() => env.availableNetworks(), [env]);

	const queryParameters = useQueryParams();
	const unvoteAddresses = queryParameters.get("unvotes")?.split(",");
	const voteAddresses = queryParameters.get("votes")?.split(",");

	const [activeTab, setActiveTab] = useState(1);
	const [unvotes, setUnvotes] = useState<Contracts.IReadOnlyWallet[]>([]);
	const [votes, setVotes] = useState<Contracts.IReadOnlyWallet[]>([]);
	const [transaction, setTransaction] = useState((null as unknown) as DTO.ExtendedSignedTransactionData);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();

	const form = useForm({ mode: "onChange" });

	const { hasDeviceAvailable, isConnected } = useLedgerContext();
	const { clearErrors, formState, getValues, handleSubmit, register, setError, setValue, watch } = form;
	const { isValid, isSubmitting } = formState;

	const { fee, fees } = watch();
	const { sendVote, common } = useValidation();

	const abortReference = useRef(new AbortController());
	const transactionBuilder = useTransactionBuilder();
	const { sign } = useWalletSignatory(activeWallet);

	useEffect(() => {
		register("network", sendVote.network());
		register("senderAddress", sendVote.senderAddress());
		register("fees");
		register("fee", common.fee(activeWallet?.balance?.(), activeWallet?.network?.()));
		register("inputFeeSettings");

		setValue("senderAddress", activeWallet.address(), { shouldDirty: true, shouldValidate: true });

		register("suppressWarning");

		for (const network of networks) {
			if (network.coin() === activeWallet.coinId() && network.id() === activeWallet.networkId()) {
				setValue("network", network, { shouldDirty: true, shouldValidate: true });

				break;
			}
		}
	}, [activeWallet, networks, register, setValue, common, getValues, sendVote]);

	const {
		dismissFeeWarning,
		feeWarningVariant,
		requireFeeConfirmation,
		showFeeWarning,
		setShowFeeWarning,
	} = useFeeConfirmation(fee, fees);

	useEffect(() => {
		if (unvoteAddresses && unvotes.length === 0) {
			const unvoteDelegates = unvoteAddresses?.map((address) =>
				env.delegates().findByAddress(activeWallet.coinId(), activeWallet.networkId(), address),
			);

			setUnvotes(unvoteDelegates);
		}
	}, [activeWallet, env, unvoteAddresses, unvotes]);

	useEffect(() => {
		if (voteAddresses && votes.length === 0) {
			const voteDelegates = voteAddresses?.map((address) =>
				env.delegates().findByAddress(activeWallet.coinId(), activeWallet.networkId(), address),
			);

			setVotes(voteDelegates);
		}
	}, [activeWallet, env, voteAddresses, votes]);

	const handleBack = () => {
		// Abort any existing listener
		abortReference.current.abort();

		if (activeTab === 1) {
			const parameters = new URLSearchParams();

			if (unvoteAddresses) {
				parameters.append("unvotes", unvoteAddresses.join(","));
			}

			if (voteAddresses) {
				parameters.append("votes", voteAddresses.join(","));
			}

			return history.push({
				pathname: `/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/votes`,
				search: `?${parameters}`,
			});
		}

		setActiveTab(activeTab - 1);
	};

	const handleNext = async (suppressWarning?: boolean) => {
		abortReference.current = new AbortController();

		const newIndex = activeTab + 1;

		if (newIndex === 3 && requireFeeConfirmation && !suppressWarning) {
			return setShowFeeWarning(true);
		}

		const senderWallet = activeProfile.wallets().findByAddress(getValues("senderAddress"));

		// Skip authorization step
		if (newIndex === 3 && senderWallet?.isMultiSignature()) {
			await handleSubmit(submitForm)();
			return;
		}

		if (newIndex === 3 && senderWallet?.isLedger()) {
			handleSubmit(submitForm)();
		}

		setActiveTab(newIndex);
	};

	const confirmSendVote = (type: "unvote" | "vote" | "combined") =>
		new Promise((resolve) => {
			const interval = setInterval(async () => {
				let isConfirmed = false;

				await activeWallet.synchroniser().votes();
				const walletVotes = activeWallet.voting().current();

				if (type === "vote") {
					isConfirmed = !!walletVotes.find((vote) => vote.address() === votes[0].address());
				}

				if (type === "unvote") {
					isConfirmed = !walletVotes.find((vote) => vote.address() === unvotes[0].address());
				}

				if (type === "combined") {
					const voteConfirmed = !!walletVotes.find((vote) => vote.address() === votes[0].address());
					const unvoteConfirmed = !walletVotes.find((vote) => vote.address() === unvotes[0].address());

					isConfirmed = voteConfirmed && unvoteConfirmed;
				}

				/* istanbul ignore else */
				if (isConfirmed) {
					clearInterval(interval);
					resolve();
				}

				return;
			}, 1000);
		});

	const submitForm = async () => {
		clearErrors("mnemonic");
		const { fee, mnemonic, secondMnemonic, encryptionPassword, wif, privateKey, secret } = getValues();
		const abortSignal = abortReference.current?.signal;

		try {
			const signatory = await sign({
				encryptionPassword,
				mnemonic,
				privateKey,
				secondMnemonic,
				secret,
				wif,
			});

			const voteTransactionInput: Services.TransactionInput = {
				fee: +fee,
				signatory,
			};

			const senderWallet = activeProfile.wallets().findByAddress(getValues("senderAddress"));

			if (unvotes.length > 0 && votes.length > 0) {
				// @README: This needs to be temporarily hardcoded here because we need to create 1 or 2
				// transactions but the SDK is only capable of creating 1 transaction because it has no
				// concept of all those weird legacy constructs that exist within ARK.
				/* istanbul ignore next */
				if (senderWallet?.networkId() === "ark.mainnet") {
					const unvoteResult = await transactionBuilder.build(
						"vote",
						{
							...voteTransactionInput,
							data: {
								unvotes: unvotes.map((wallet: Contracts.IReadOnlyWallet) => wallet.publicKey()),
							},
						},
						senderWallet,
						{ abortSignal },
					);

					const unvoteResponse = await activeWallet.transaction().broadcast(unvoteResult.uuid);

					handleBroadcastError(unvoteResponse);

					await persist();

					await confirmSendVote("unvote");

					const voteResult = await transactionBuilder.build(
						"vote",
						{
							...voteTransactionInput,
							data: {
								votes: votes.map((wallet: Contracts.IReadOnlyWallet) => wallet.publicKey()),
							},
						},
						senderWallet,
						{ abortSignal },
					);

					const voteResponse = await activeWallet.transaction().broadcast(voteResult.uuid);

					handleBroadcastError(voteResponse);

					await persist();

					setTransaction(voteResult.transaction);

					setActiveTab(4);

					await confirmSendVote("vote");
				} else {
					// @README: If we are not interacting with ark.mainnet we can combine the
					// votes and unvotes in a single transaction to save fees and processing time.
					const { uuid, transaction } = await transactionBuilder.build(
						"vote",
						{
							...voteTransactionInput,
							data: {
								unvotes: unvotes.map((wallet: Contracts.IReadOnlyWallet) => wallet.publicKey()),
								votes: votes.map((wallet: Contracts.IReadOnlyWallet) => wallet.publicKey()),
							},
						},
						senderWallet!,
						{ abortSignal },
					);

					const voteResponse = await activeWallet.transaction().broadcast(uuid);

					handleBroadcastError(voteResponse);

					await persist();

					setTransaction(transaction);

					setActiveTab(4);

					await confirmSendVote("combined");
				}
			} else {
				const isUnvote = unvotes.length > 0;
				const { uuid, transaction } = await transactionBuilder.build(
					"vote",
					{
						...voteTransactionInput,
						data: isUnvote
							? {
									unvotes: unvotes.map((wallet: Contracts.IReadOnlyWallet) => wallet.publicKey()),
							  }
							: {
									votes: votes.map((wallet: Contracts.IReadOnlyWallet) => wallet.publicKey()),
							  },
					},
					senderWallet!,
					{ abortSignal },
				);

				const response = await activeWallet.transaction().broadcast(uuid);

				handleBroadcastError(response);

				await persist();

				setTransaction(transaction);

				setActiveTab(4);

				await confirmSendVote(isUnvote ? "unvote" : "vote");
			}
		} catch (error) {
			/* istanbul ignore next */
			if (isMnemonicError(error)) {
				/* istanbul ignore next */
				setValue("mnemonic", "");
				/* istanbul ignore next */
				return setError("mnemonic", { message: t("TRANSACTION.INVALID_MNEMONIC"), type: "manual" });
			}

			setErrorMessage(JSON.stringify({ message: error.message, type: error.name }));
			setActiveTab(5);
		}
	};

	const hideStepNavigation = activeTab === 5 || (activeTab === 3 && activeWallet.isLedger());

	return (
		<Page profile={activeProfile}>
			<Section className="flex-1">
				<Form className="mx-auto max-w-xl" context={form} onSubmit={submitForm}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FormStep
									profile={activeProfile}
									unvotes={unvotes}
									votes={votes}
									wallet={activeWallet}
								/>
							</TabPanel>

							<TabPanel tabId={2}>
								<ReviewStep unvotes={unvotes} votes={votes} wallet={activeWallet} />
							</TabPanel>

							<TabPanel tabId={3}>
								<AuthenticationStep
									wallet={activeWallet}
									ledgerDetails={
										<VoteLedgerReview wallet={activeWallet} votes={votes} unvotes={unvotes} />
									}
									ledgerIsAwaitingDevice={!hasDeviceAvailable}
									ledgerIsAwaitingApp={hasDeviceAvailable && !isConnected}
								/>
							</TabPanel>

							<TabPanel tabId={4}>
								<SummaryStep
									senderWallet={activeWallet}
									transaction={transaction}
									unvotes={unvotes}
									votes={votes}
								/>
							</TabPanel>

							<TabPanel tabId={5}>
								<ErrorStep
									onBack={() =>
										history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`)
									}
									isRepeatDisabled={isSubmitting}
									onRepeat={handleSubmit(submitForm)}
									errorMessage={errorMessage}
								/>
							</TabPanel>

							{!hideStepNavigation && (
								<StepNavigation
									onBackClick={handleBack}
									onBackToWalletClick={() =>
										history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`)
									}
									onContinueClick={async () => await handleNext()}
									isLoading={isSubmitting}
									isNextDisabled={!isValid}
									size={4}
									activeIndex={activeTab}
								/>
							)}
						</div>
					</Tabs>

					<FeeWarning
						isOpen={showFeeWarning}
						variant={feeWarningVariant}
						onCancel={(suppressWarning: boolean) => dismissFeeWarning(handleBack, suppressWarning)}
						onConfirm={(suppressWarning: boolean) =>
							dismissFeeWarning(async () => await handleNext(true), suppressWarning)
						}
					/>
				</Form>
			</Section>
		</Page>
	);
};
