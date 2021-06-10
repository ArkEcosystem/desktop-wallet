import { Contracts, Services } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext, useLedgerContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useQueryParams, useValidation } from "app/hooks";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import { ErrorStep } from "domains/transaction/components/ErrorStep";
import { FeeWarning } from "domains/transaction/components/FeeWarning";
import { useFeeConfirmation, useTransactionBuilder, useWalletSignatory } from "domains/transaction/hooks";
import { handleBroadcastError } from "domains/transaction/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FormStep, ReviewStep, SummaryStep } from "./";
import { VoteLedgerReview } from "./LedgerReview";

export const SendVote = () => {
	const { t } = useTranslation();
	const { env, persist } = useEnvironmentContext();
	const history = useHistory();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const networks = useMemo(() => env.availableNetworks(), [env]);

	const queryParams = useQueryParams();
	const unvoteAddresses = queryParams.get("unvotes")?.split(",");
	const voteAddresses = queryParams.get("votes")?.split(",");

	const [activeTab, setActiveTab] = useState(1);
	const [unvotes, setUnvotes] = useState<ProfileContracts.IReadOnlyWallet[]>([]);
	const [votes, setVotes] = useState<ProfileContracts.IReadOnlyWallet[]>([]);
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);

	const form = useForm({ mode: "onChange" });

	const { hasDeviceAvailable, isConnected } = useLedgerContext();
	const { clearErrors, formState, getValues, handleSubmit, register, setValue, watch } = form;
	const { isValid, isSubmitting } = formState;

	const { fee, fees } = watch();
	const { sendVote, common } = useValidation();

	const abortRef = useRef(new AbortController());
	const transactionBuilder = useTransactionBuilder(activeProfile);
	const { sign } = useWalletSignatory(activeWallet);

	useEffect(() => {
		register("network", sendVote.network());
		register("senderAddress", sendVote.senderAddress());
		register("fees");
		register("fee", common.fee(activeWallet?.balance?.(), activeWallet?.network?.()));
		register("inputFeeViewType");

		setValue("senderAddress", activeWallet.address(), { shouldValidate: true, shouldDirty: true });

		register("suppressWarning");

		for (const network of networks) {
			if (network.coin() === activeWallet.coinId() && network.id() === activeWallet.networkId()) {
				setValue("network", network, { shouldValidate: true, shouldDirty: true });

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
		abortRef.current.abort();

		if (activeTab === 1) {
			const params = new URLSearchParams();

			if (unvoteAddresses) {
				params.append("unvotes", unvoteAddresses.join());
			}

			if (voteAddresses) {
				params.append("votes", voteAddresses.join());
			}

			return history.push({
				pathname: `/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/votes`,
				search: `?${params}`,
			});
		}

		setActiveTab(activeTab - 1);
	};

	const handleNext = async (suppressWarning?: boolean) => {
		abortRef.current = new AbortController();

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
		const { fee, mnemonic, secondMnemonic, encryptionPassword } = getValues();
		const abortSignal = abortRef.current?.signal;

		try {
			const signatory = await sign({
				mnemonic,
				secondMnemonic,
				encryptionPassword,
			});

			const voteTransactionInput: Services.TransactionInput = {
				fee,
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
								unvotes: unvotes.map((wallet: ProfileContracts.IReadOnlyWallet) => wallet.publicKey()),
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
								votes: votes.map((wallet: ProfileContracts.IReadOnlyWallet) => wallet.publicKey()),
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
								votes: votes.map((wallet: ProfileContracts.IReadOnlyWallet) => wallet.publicKey()),
								unvotes: unvotes.map((wallet: ProfileContracts.IReadOnlyWallet) => wallet.publicKey()),
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
									unvotes: unvotes.map((wallet: ProfileContracts.IReadOnlyWallet) =>
										wallet.publicKey(),
									),
							  }
							: {
									votes: votes.map((wallet: ProfileContracts.IReadOnlyWallet) => wallet.publicKey()),
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
			setActiveTab(5);
		}
	};

	return (
		<Page profile={activeProfile}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={submitForm}>
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
								<ReviewStep
									profile={activeProfile}
									unvotes={unvotes}
									votes={votes}
									wallet={activeWallet}
								/>
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
								/>
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-3">
								{activeTab < 4 && (
									<>
										{activeTab < 3 && (
											<>
												<Button
													disabled={isSubmitting}
													variant="secondary"
													onClick={handleBack}
													data-testid="SendVote__button--back"
												>
													{t("COMMON.BACK")}
												</Button>
												<Button
													disabled={!isValid || isSubmitting}
													isLoading={isSubmitting}
													onClick={async () => await handleNext()}
													data-testid="SendVote__button--continue"
												>
													{t("COMMON.CONTINUE")}
												</Button>
											</>
										)}

										{activeTab === 3 && !activeWallet.isLedger() && (
											<>
												<Button
													disabled={isSubmitting}
													variant="secondary"
													onClick={handleBack}
													data-testid="SendVote__button--back"
												>
													{t("COMMON.BACK")}
												</Button>
												<Button
													type="submit"
													data-testid="SendVote__button--submit"
													disabled={!isValid || isSubmitting}
													isLoading={isSubmitting}
													icon="Send"
												>
													<span>{t("COMMON.SEND")}</span>
												</Button>
											</>
										)}
									</>
								)}

								{activeTab === 4 && (
									<Button
										data-testid="SendVote__button--back-to-wallet"
										variant="secondary"
										onClick={() =>
											history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`)
										}
									>
										{t("COMMON.BACK_TO_WALLET")}
									</Button>
								)}
							</div>
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
