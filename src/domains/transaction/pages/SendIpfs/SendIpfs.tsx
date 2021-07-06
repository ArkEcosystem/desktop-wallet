import { Services } from "@arkecosystem/platform-sdk";
import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { StepNavigation } from "app/components/StepNavigation";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext, useLedgerContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useValidation } from "app/hooks";
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
import { IpfsLedgerReview } from "./LedgerReview";

export const SendIpfs = () => {
	const { t } = useTranslation();
	const history = useHistory();

	const [activeTab, setActiveTab] = useState(1);
	const [transaction, setTransaction] = useState((null as unknown) as DTO.ExtendedSignedTransactionData);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();

	const { env, persist } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const networks = useMemo(() => env.availableNetworks(), [env]);
	const { sendIpfs, common } = useValidation();

	const form = useForm({ mode: "onChange" });

	const { hasDeviceAvailable, isConnected, connect, transport } = useLedgerContext();
	const { clearErrors, formState, getValues, handleSubmit, register, setError, setValue, watch } = form;
	const { isValid, isSubmitting } = formState;

	const { fee, fees } = watch();

	const abortReference = useRef(new AbortController());
	const transactionBuilder = useTransactionBuilder();
	const { sign } = useWalletSignatory(activeWallet);

	useEffect(() => {
		register("network", sendIpfs.network());
		register("senderAddress", sendIpfs.senderAddress());
		register("hash", sendIpfs.hash());
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
	}, [activeWallet, networks, register, setValue, t, fees, sendIpfs, common]);

	const {
		dismissFeeWarning,
		feeWarningVariant,
		requireFeeConfirmation,
		showFeeWarning,
		setShowFeeWarning,
	} = useFeeConfirmation(fee, fees);

	const submitForm = async () => {
		clearErrors("mnemonic");

		const { fee, mnemonic, secondMnemonic, hash, encryptionPassword, wif, privateKey, secret } = getValues();

		const signatory = await sign({
			encryptionPassword,
			mnemonic,
			privateKey,
			secondMnemonic,
			secret,
			wif,
		});

		const transactionInput: Services.IpfsInput = {
			data: { hash },
			fee: +fee,
			signatory,
		};

		try {
			if (activeWallet.isLedger()) {
				await connect(activeProfile, activeWallet.coinId(), activeWallet.networkId());
				await activeWallet.ledger().connect(transport);
			}

			const abortSignal = abortReference.current?.signal;
			const { uuid, transaction } = await transactionBuilder.build("ipfs", transactionInput, activeWallet, {
				abortSignal,
			});

			const response = await activeWallet.transaction().broadcast(uuid);

			handleBroadcastError(response);

			await persist();

			setTransaction(transaction);
			setActiveTab(4);
		} catch (error) {
			if (isMnemonicError(error)) {
				setValue("mnemonic", "");
				return setError("mnemonic", { message: t("TRANSACTION.INVALID_MNEMONIC"), type: "manual" });
			}

			setErrorMessage(JSON.stringify({ message: error.message, type: error.name }));
			setActiveTab(5);
		}
	};

	const handleBack = () => {
		// Abort any existing listener
		abortReference.current.abort();

		if (activeTab === 1) {
			return history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`);
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

	const hideStepNavigation = activeTab === 5 || (activeTab === 3 && activeWallet.isLedger());

	return (
		<Page profile={activeProfile}>
			<Section className="flex-1">
				<Form className="mx-auto max-w-xl" context={form} onSubmit={submitForm}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FormStep profile={activeProfile} wallet={activeWallet} />
							</TabPanel>

							<TabPanel tabId={2}>
								<ReviewStep wallet={activeWallet} />
							</TabPanel>

							<TabPanel tabId={3}>
								<AuthenticationStep
									wallet={activeWallet}
									ledgerDetails={<IpfsLedgerReview wallet={activeWallet} />}
									ledgerIsAwaitingDevice={!hasDeviceAvailable}
									ledgerIsAwaitingApp={hasDeviceAvailable && !isConnected}
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
									isRepeatDisabled={isSubmitting}
									onRepeat={form.handleSubmit(submitForm)}
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

SendIpfs.defaultProps = {
	networks: [],
};
