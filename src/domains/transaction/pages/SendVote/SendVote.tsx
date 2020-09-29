import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useQueryParams } from "app/hooks";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { FourthStep } from "./Step4";

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
	const { clearErrors, formState, getValues, register, setError, setValue } = form;

	useEffect(() => {
		register("network", { required: true });
		register("senderAddress", { required: true });
		register("fee", { required: true });

		setValue("senderAddress", activeWallet.address(), { shouldValidate: true, shouldDirty: true });

		for (const network of networks) {
			if (network.coin() === activeWallet.coinId() && network.id() === activeWallet.networkId()) {
				setValue("network", network, { shouldValidate: true, shouldDirty: true });

				break;
			}
		}
	}, [activeWallet, networks, register, setValue]);

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
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
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
		const senderWallet = activeProfile.wallets().findByAddress(senderAddress);

		try {
			const voteTransactionInput = {
				fee,
				from: senderAddress,
				sign: {
					mnemonic,
					secondMnemonic,
				},
			};

			if (unvotes.length > 0 && votes.length > 0) {
				const unvoteTransactionId = await senderWallet!.transaction().signVote({
					...voteTransactionInput,
					data: {
						vote: `-${unvotes[0].publicKey()}`,
					},
				});

				await senderWallet!.transaction().broadcast(unvoteTransactionId);

				await env.persist();

				await confirmSendVote("unvote");

				const voteTransactionId = await senderWallet!.transaction().signVote({
					...voteTransactionInput,
					data: {
						vote: `+${votes[0].publicKey()}`,
					},
				});

				await senderWallet!.transaction().broadcast(voteTransactionId);

				await env.persist();

				setTransaction(senderWallet!.transaction().transaction(voteTransactionId));

				handleNext();

				await confirmSendVote("vote");
			} else {
				const isUnvote = unvotes.length > 0;
				const transactionId = await senderWallet!.transaction().signVote({
					...voteTransactionInput,
					data: {
						vote: isUnvote ? `-${unvotes[0].publicKey()}` : `+${votes[0].publicKey()}`,
					},
				});

				await senderWallet!.transaction().broadcast(transactionId);

				await env.persist();

				setTransaction(senderWallet!.transaction().transaction(transactionId));

				handleNext();

				await confirmSendVote(isUnvote ? "unvote" : "vote");
			}
		} catch (error) {
			console.error("Could not vote: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", { type: "manual", message: t("TRANSACTION.INVALID_MNEMONIC") });
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
								<FirstStep
									profile={activeProfile}
									unvotes={unvotes}
									votes={votes}
									wallet={activeWallet}
								/>
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep
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
								<FourthStep
									senderWallet={activeWallet}
									transaction={transaction}
									unvotes={unvotes}
									votes={votes}
								/>
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-3">
								{activeTab < 4 && (
									<>
										<Button
											disabled={
												activeTab === 1 || (activeTab === 3 ? formState.isSubmitting : false)
											}
											variant="plain"
											onClick={handleBack}
											data-testid="SendVote__button--back"
										>
											{t("COMMON.BACK")}
										</Button>

										{activeTab < 3 && (
											<Button
												disabled={!formState.isValid}
												onClick={handleNext}
												data-testid="SendVote__button--continue"
											>
												{t("COMMON.CONTINUE")}
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
												<span>{t("COMMON.SEND")}</span>
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
