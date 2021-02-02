import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useQueryParams, useValidation } from "app/hooks";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import { ErrorStep } from "domains/transaction/components/ErrorStep";
import { useTransactionBuilder } from "domains/transaction/hooks/use-transaction-builder";
import { isMnemonicError } from "domains/transaction/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FormStep, ReviewStep, SummaryStep } from "./";
import { VoteLedgerReview } from "./LedgerReview";

export const SendVote = () => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();
	const history = useHistory();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const networks = useMemo(() => env.availableNetworks(), [env]);

	const queryParams = useQueryParams();
	const unvoteAddresses = queryParams.get("unvotes")?.split(",");
	const voteAddresses = queryParams.get("votes")?.split(",");

	const [activeTab, setActiveTab] = useState(1);
	const [unvotes, setUnvotes] = useState<ReadOnlyWallet[]>([]);
	const [votes, setVotes] = useState<ReadOnlyWallet[]>([]);
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);

	const form = useForm({ mode: "onChange" });
	const { clearErrors, formState, getValues, register, setError, setValue, handleSubmit } = form;
	const { sendVote, common } = useValidation();

	const abortRef = useRef(new AbortController());
	const transactionBuilder = useTransactionBuilder(activeProfile);

	useEffect(() => {
		register("network", sendVote.network());
		register("senderAddress", sendVote.senderAddress());
		register("fees");
		register(
			"fee",
			common.fee(() => getValues("fees"), activeWallet?.balance?.(), activeWallet?.network?.()),
		);

		setValue("senderAddress", activeWallet.address(), { shouldValidate: true, shouldDirty: true });

		for (const network of networks) {
			if (network.coin() === activeWallet.coinId() && network.id() === activeWallet.networkId()) {
				setValue("network", network, { shouldValidate: true, shouldDirty: true });

				break;
			}
		}
	}, [activeWallet, networks, register, setValue, common, getValues, sendVote]);

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

	const crumbs = [
		{
			label: t("COMMON.PORTFOLIO"),
			route: `/profiles/${activeProfile.id()}/dashboard`,
		},
		{
			label: activeWallet.alias() || /* istanbul ignore next */ activeWallet.address(),
			route: `/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`,
		},
		{
			label: t("TRANSACTION.PAGE_VOTE.FIRST_STEP.TITLE"),
		},
	];

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

	const handleNext = async () => {
		abortRef.current = new AbortController();

		const newIndex = activeTab + 1;
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

				await activeWallet.syncVotes();
				const walletVotes = activeWallet.votes();

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

				if (isConfirmed) {
					clearInterval(interval);
					resolve();
				}

				return;
			}, 1000);
		});

	const submitForm = async () => {
		clearErrors("mnemonic");
		const { fee, mnemonic, secondMnemonic, senderAddress } = getValues();

		const abortSignal = abortRef.current?.signal;

		try {
			const voteTransactionInput: Contracts.TransactionInput = {
				fee,
				from: senderAddress,
				sign: {
					mnemonic,
					secondMnemonic,
				},
			};

			if (unvotes.length > 0 && votes.length > 0) {
				const senderWallet = activeProfile.wallets().findByAddress(getValues("senderAddress"));

				// @README: This needs to be temporarily hardcoded here because we need to create 1 or 2
				// transactions but the SDK is only capable of creating 1 transaction because it has no
				// concept of all those weird legacy constructs that exist within ARK.
				/* istanbul ignore next */
				if (senderWallet?.networkId() === "ark.mainnet") {
					const unvoteTransaction = await transactionBuilder.build(
						"vote",
						{
							...voteTransactionInput,
							data: {
								unvotes: unvotes.map((wallet: ReadOnlyWallet) => wallet.publicKey()),
							},
						},
						{ abortSignal },
					);

					await transactionBuilder.broadcast(unvoteTransaction.id(), voteTransactionInput);

					await env.persist();

					await confirmSendVote("unvote");

					const voteTransaction = await transactionBuilder.build(
						"vote",
						{
							...voteTransactionInput,
							data: {
								votes: votes.map((wallet: ReadOnlyWallet) => wallet.publicKey()),
							},
						},
						{ abortSignal },
					);

					await transactionBuilder.broadcast(voteTransaction.id(), voteTransactionInput);

					await env.persist();

					setTransaction(voteTransaction);

					setActiveTab(4);

					await confirmSendVote("vote");
				} else {
					// @README: If we are not interacting with ark.mainnet we can combine the
					// votes and unvotes in a single transaction to save fees and processing time.
					const voteTransaction = await transactionBuilder.build(
						"vote",
						{
							...voteTransactionInput,
							data: {
								votes: votes.map((wallet: ReadOnlyWallet) => wallet.publicKey()),
								unvotes: unvotes.map((wallet: ReadOnlyWallet) => wallet.publicKey()),
							},
						},
						{ abortSignal },
					);

					await transactionBuilder.broadcast(voteTransaction.id(), voteTransactionInput);

					await env.persist();

					setTransaction(voteTransaction);

					setActiveTab(4);

					await confirmSendVote("combined");
				}
			} else {
				const isUnvote = unvotes.length > 0;
				const transaction = await transactionBuilder.build(
					"vote",
					{
						...voteTransactionInput,
						data: isUnvote
							? {
									unvotes: unvotes.map((wallet: ReadOnlyWallet) => wallet.publicKey()),
							  }
							: {
									votes: votes.map((wallet: ReadOnlyWallet) => wallet.publicKey()),
							  },
					},
					{ abortSignal },
				);

				await transactionBuilder.broadcast(transaction.id(), voteTransactionInput);

				await env.persist();

				setTransaction(transaction);

				setActiveTab(4);

				await confirmSendVote(isUnvote ? "unvote" : "vote");
			}
		} catch (error) {
			console.log(error);

			if (isMnemonicError(error)) {
				setValue("mnemonic", "");
				return setError("mnemonic", { type: "manual", message: t("TRANSACTION.INVALID_MNEMONIC") });
			}

			setActiveTab(5);
		}
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
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
										<VoteLedgerReview
											wallet={activeWallet}
											votes={votes}
											unvotes={unvotes}
											fee={getValues("fee")}
										/>
									}
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
									isRepeatDisabled={formState.isSubmitting}
									onRepeat={form.handleSubmit(submitForm)}
								/>
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-3">
								{activeTab < 4 && (
									<>
										{activeTab < 3 && (
											<>
												<Button
													disabled={formState.isSubmitting}
													variant="secondary"
													onClick={handleBack}
													data-testid="SendVote__button--back"
												>
													{t("COMMON.BACK")}
												</Button>
												<Button
													disabled={!formState.isValid || formState.isSubmitting}
													isLoading={formState.isSubmitting}
													onClick={handleNext}
													data-testid="SendVote__button--continue"
												>
													{t("COMMON.CONTINUE")}
												</Button>
											</>
										)}

										{activeTab === 3 && !activeWallet.isLedger() && (
											<>
												<Button
													disabled={formState.isSubmitting}
													variant="secondary"
													onClick={handleBack}
													data-testid="SendVote__button--back"
												>
													{t("COMMON.BACK")}
												</Button>
												<Button
													type="submit"
													data-testid="SendVote__button--submit"
													disabled={!formState.isValid || formState.isSubmitting}
													isLoading={formState.isSubmitting}
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
				</Form>
			</Section>
		</Page>
	);
};
