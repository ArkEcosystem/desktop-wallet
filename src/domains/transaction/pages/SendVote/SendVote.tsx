import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { Spinner } from "app/components/Spinner";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useQueryParams, useValidation } from "app/hooks";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import { ErrorStep } from "domains/transaction/components/ErrorStep";
import { useTransactionBuilder } from "domains/transaction/hooks/use-transaction-builder";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FormStep, ReviewStep, SummaryStep } from "./";

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
		register("fee", common.fee(getValues("fees"), activeWallet?.balance?.(), activeWallet?.network?.()));

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
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
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

	const confirmSendVote = (type: "unvote" | "vote") =>
		new Promise((resolve) => {
			const interval = setInterval(async () => {
				let isConfirmed = false;

				await activeWallet.syncVotes();
				const walletVotes = activeWallet.votes();

				isConfirmed =
					type === "unvote"
						? !walletVotes.find((vote) => vote.address() === unvotes[0].address())
						: !!walletVotes.find((vote) => vote.address() === votes[0].address());

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
				const unvoteTransaction = await transactionBuilder.build(
					"vote",
					{
						...voteTransactionInput,
						data: {
							vote: `-${unvotes[0].publicKey()}`,
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
							vote: `+${votes[0].publicKey()}`,
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
				const isUnvote = unvotes.length > 0;
				const transaction = await transactionBuilder.build(
					"vote",
					{
						...voteTransactionInput,
						data: {
							vote: isUnvote ? `-${unvotes[0].publicKey()}` : `+${votes[0].publicKey()}`,
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
			if (String(error).includes("Signatory should be")) {
				setValue("mnemonic", "");
				return setError("mnemonic", { type: "manual", message: t("TRANSACTION.INVALID_MNEMONIC") });
			}

			setActiveTab(5);
		}
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
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
								<AuthenticationStep wallet={activeWallet} />
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
										<Button
											disabled={activeTab === 3 ? formState.isSubmitting : false}
											variant="plain"
											onClick={handleBack}
											data-testid="SendVote__button--back"
										>
											{t("COMMON.BACK")}
										</Button>

										{activeTab < 3 && (
											<Button
												disabled={!formState.isValid || formState.isSubmitting}
												onClick={handleNext}
												data-testid="SendVote__button--continue"
											>
												{formState.isSubmitting ? <Spinner size="sm" /> : t("COMMON.CONTINUE")}
											</Button>
										)}

										{activeTab === 3 && (
											<Button
												type="submit"
												data-testid="SendVote__button--submit"
												disabled={!formState.isValid || formState.isSubmitting}
												className="space-x-2"
											>
												<Icon name="Send" width={20} height={20} />
												{formState.isSubmitting ? (
													<Spinner size="sm" />
												) : (
													<span>{t("COMMON.SEND")}</span>
												)}
											</Button>
										)}
									</>
								)}

								{activeTab === 4 && (
									<>
										<Button
											data-testid="SendVote__button--back-to-wallet"
											variant="plain"
											onClick={() =>
												history.push(
													`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`,
												)
											}
										>
											{t("COMMON.BACK_TO_WALLET")}
										</Button>
										<Button
											variant="plain"
											className="space-x-2"
											data-testid="SendVote__button--download"
										>
											<Icon name="Download" />
											<span>{t("COMMON.DOWNLOAD")}</span>
										</Button>
									</>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};
