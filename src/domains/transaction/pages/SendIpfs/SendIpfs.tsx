import { Contracts } from "@arkecosystem/platform-sdk";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useValidation } from "app/hooks";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import { ErrorStep } from "domains/transaction/components/ErrorStep";
import { useTransactionBuilder } from "domains/transaction/hooks/use-transaction-builder";
import { isMnemonicError } from "domains/transaction/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FormStep, ReviewStep, SummaryStep } from "./";
import { IpfsLedgerReview } from "./LedgerReview";

export const SendIpfs = () => {
	const { t } = useTranslation();
	const history = useHistory();

	const [activeTab, setActiveTab] = useState(1);
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);

	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const networks = useMemo(() => env.availableNetworks(), [env]);
	const { sendIpfs, common } = useValidation();

	const form = useForm({ mode: "onChange" });
	const { clearErrors, formState, getValues, register, setError, setValue, handleSubmit } = form;
	const { fees } = form.watch();

	const abortRef = useRef(new AbortController());
	const transactionBuilder = useTransactionBuilder(activeProfile);

	useEffect(() => {
		register("network", sendIpfs.network());
		register("senderAddress", sendIpfs.senderAddress());
		register("hash", sendIpfs.hash());
		register("fees");
		register(
			"fee",
			common.fee(() => fees, activeWallet?.balance?.(), activeWallet?.network?.()),
		);

		setValue("senderAddress", activeWallet.address(), { shouldValidate: true, shouldDirty: true });

		for (const network of networks) {
			if (network.coin() === activeWallet.coinId() && network.id() === activeWallet.networkId()) {
				setValue("network", network, { shouldValidate: true, shouldDirty: true });

				break;
			}
		}
	}, [activeWallet, networks, register, setValue, t, fees, sendIpfs, common]);

	const submitForm = async () => {
		clearErrors("mnemonic");

		const { fee, mnemonic, secondMnemonic, senderAddress, hash } = getValues();

		const transactionInput: Contracts.IpfsInput = {
			fee,
			from: senderAddress,
			sign: {
				mnemonic,
				secondMnemonic,
			},
			data: { hash },
		};

		try {
			const abortSignal = abortRef.current?.signal;

			const transaction = await transactionBuilder.build("ipfs", transactionInput, { abortSignal });
			await transactionBuilder.broadcast(transaction.id(), transactionInput);

			await env.persist();

			setTransaction(transaction);
			setActiveTab(4);
		} catch (error) {
			if (isMnemonicError(error)) {
				setValue("mnemonic", "");
				return setError("mnemonic", { type: "manual", message: t("TRANSACTION.INVALID_MNEMONIC") });
			}

			setActiveTab(5);
		}
	};

	const handleBack = () => {
		// Abort any existing listener
		abortRef.current.abort();
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
			label: t("TRANSACTION.PAGE_IPFS.FIRST_STEP.TITLE"),
		},
	];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="mx-auto max-w-xl" context={form} onSubmit={submitForm}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FormStep networks={networks} profile={activeProfile} />
							</TabPanel>
							<TabPanel tabId={2}>
								<ReviewStep wallet={activeWallet} />
							</TabPanel>
							<TabPanel tabId={3}>
								<AuthenticationStep
									wallet={activeWallet}
									ledgerDetails={
										<IpfsLedgerReview
											wallet={activeWallet}
											fee={getValues("fee")}
											hash={getValues("hash")}
										/>
									}
								/>
							</TabPanel>
							<TabPanel tabId={4}>
								<SummaryStep transaction={transaction} senderWallet={activeWallet} />
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

							<div className="flex justify-end mt-10 space-x-2">
								{activeTab < 4 && (
									<>
										{activeTab < 3 && (
											<>
												<Button
													disabled={activeTab === 1}
													data-testid="SendIpfs__button--back"
													variant="secondary"
													onClick={handleBack}
												>
													{t("COMMON.BACK")}
												</Button>
												<Button
													data-testid="SendIpfs__button--continue"
													disabled={!formState.isValid || formState.isSubmitting}
													isLoading={formState.isSubmitting}
													onClick={handleNext}
												>
													{t("COMMON.CONTINUE")}
												</Button>
											</>
										)}

										{activeTab === 3 && !activeWallet.isLedger() && (
											<>
												<Button
													data-testid="SendIpfs__button--back"
													variant="secondary"
													onClick={handleBack}
												>
													{t("COMMON.BACK")}
												</Button>

												<Button
													type="submit"
													data-testid="SendIpfs__button--submit"
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
										data-testid="SendIpfs__button--back-to-wallet"
										variant="secondary"
										className="block"
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

SendIpfs.defaultProps = {
	networks: [],
};
