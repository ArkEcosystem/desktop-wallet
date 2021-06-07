import { Contracts, Networks, Services } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext, useLedgerContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useQueryParams, useValidation } from "app/hooks";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import { ConfirmSendTransaction } from "domains/transaction/components/ConfirmSendTransaction";
import { ErrorStep } from "domains/transaction/components/ErrorStep";
import { FeeWarning } from "domains/transaction/components/FeeWarning";
import {
	useFeeConfirmation,
	useTransaction,
	useTransactionBuilder,
	useWalletSignatory,
} from "domains/transaction/hooks";
import { handleBroadcastError, isMnemonicError } from "domains/transaction/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { FormStep, ReviewStep, SummaryStep } from "./";
import { TransferLedgerReview } from "./LedgerReview";
import { NetworkStep } from "./NetworkStep";

export const SendTransfer = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const profile = useActiveProfile();
	const { walletId: hasWalletId } = useParams();

	const queryParams = useQueryParams();

	const deepLinkParams = useMemo(() => {
		const result: Record<string, string> = {};
		for (const [key, value] of queryParams.entries()) {
			result[key] = value;
		}
		return result;
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const hasDeepLinkParams = Object.keys(deepLinkParams).length > 0;

	const showNetworkStep = !hasDeepLinkParams && !hasWalletId;
	const firstTabIndex = showNetworkStep ? 0 : 1;

	const [activeTab, setActiveTab] = useState(showNetworkStep ? 0 : 1);
	const [unconfirmedTransactions, setUnconfirmedTransactions] = useState<DTO.ExtendedTransactionData[]>([]);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [transaction, setTransaction] = useState<Contracts.SignedTransactionData | null>(null);

	const { persist } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const [wallet, setWallet] = useState<ProfileContracts.IReadWriteWallet | undefined>(
		hasWalletId ? activeWallet : undefined,
	);

	const networks = useMemo(() => {
		const results: Record<string, Networks.Network> = {};
		for (const wallet of profile.wallets().values()) {
			results[wallet.networkId()] = wallet.network();
		}
		return Object.values(results);
	}, [profile]);

	const form = useForm<any>({
		mode: "onChange",
		defaultValues: {
			fee: 0,
			amount: 0,
			remainingBalance: wallet?.balance?.(),
			recipients: [],
		},
	});

	const { clearErrors, formState, getValues, register, setError, setValue, handleSubmit, watch } = form;
	const { isValid, isSubmitting } = formState;

	const { senderAddress, fees, fee, remainingBalance, amount, isSendAllSelected, network } = watch();
	const { sendTransfer, common } = useValidation();

	const { hasDeviceAvailable, isConnected } = useLedgerContext();

	const [lastEstimatedExpiration, setLastEstimatedExpiration] = useState<number | undefined>();
	const abortRef = useRef(new AbortController());
	const transactionBuilder = useTransactionBuilder(activeProfile);
	const { sign } = useWalletSignatory(wallet!);
	const { fetchWalletUnconfirmedTransactions } = useTransaction();

	useEffect(() => {
		register("remainingBalance");
		register("network", sendTransfer.network());
		register("recipients");
		register("senderAddress", sendTransfer.senderAddress());
		register("fees");
		register("fee", common.fee(remainingBalance, wallet?.network?.()));
		register("smartbridge", sendTransfer.smartbridge());

		register("remainingBalance");
		register("isSendAllSelected");

		register("suppressWarning");
	}, [register, sendTransfer, common, fees, wallet, remainingBalance, amount, senderAddress]);

	const {
		dismissFeeWarning,
		feeWarningVariant,
		requireFeeConfirmation,
		showFeeWarning,
		setShowFeeWarning,
	} = useFeeConfirmation(fee, fees);

	useEffect(() => {
		setWallet(activeProfile.wallets().findByAddress(senderAddress || ""));
	}, [activeProfile, senderAddress]);

	useEffect(() => {
		if (Object.keys(deepLinkParams).length === 0) {
			return;
		}

		setValue(
			"network",
			networks.find(
				(item) =>
					item.coin().toLowerCase() === deepLinkParams.coin?.toLowerCase() &&
					item.id().toLowerCase() === deepLinkParams.network?.toLowerCase(),
			),
		);

		if (deepLinkParams.memo) {
			setValue("smartbridge", deepLinkParams.memo);
		}

		if (deepLinkParams.recipient) {
			setTimeout(
				() =>
					setValue("recipientAddress", deepLinkParams.recipient, {
						shouldDirty: true,
						shouldValidate: false,
					}),
				0,
			);
		}
	}, [deepLinkParams, setValue, networks]);

	useEffect(() => {
		if (!wallet?.address?.()) {
			return;
		}

		setValue("senderAddress", wallet.address(), { shouldValidate: true, shouldDirty: true });

		for (const network of networks) {
			/* istanbul ignore else */
			if (network.coin() === wallet.coinId() && network.id() === wallet.networkId()) {
				setValue("network", network, { shouldValidate: true, shouldDirty: true });

				break;
			}
		}
	}, [wallet, networks, setValue]);

	useEffect(() => {
		if (!isSendAllSelected) {
			return;
		}

		if (BigNumber.make(amount).isLessThanOrEqualTo(fee)) {
			return;
		}

		const remaining = remainingBalance.minus(fee);

		setValue("displayAmount", remaining.toHuman());
		setValue("amount", remaining.toString());

		form.trigger(["fee", "amount"]);
	}, [fee]); // eslint-disable-line react-hooks/exhaustive-deps

	const submitForm = async (skipUnconfirmedCheck = false) => {
		if (!skipUnconfirmedCheck) {
			const unconfirmed = await fetchWalletUnconfirmedTransactions(wallet!);
			setUnconfirmedTransactions(unconfirmed);

			if (unconfirmed.length) {
				setIsConfirmModalOpen(true);
				return;
			}
		}

		clearErrors("mnemonic");

		const {
			fee,
			mnemonic,
			secondMnemonic,
			recipients,
			smartbridge,
			encryptionPassword,
			wif,
			privateKey,
		} = getValues();
		const isMultiPayment = recipients.length > 1;
		const transactionType = isMultiPayment ? "multiPayment" : "transfer";

		try {
			const signatory = await sign({
				mnemonic,
				secondMnemonic,
				encryptionPassword,
				wif,
				privateKey,
			});

			const transactionInput: Services.TransactionInputs = {
				fee,
				signatory,
				data: {},
			};

			if (isMultiPayment) {
				transactionInput.data = {
					payments: recipients.map(({ address, amount }: { address: string; amount: BigNumber }) => ({
						to: address,
						amount: amount.toHuman(),
					})),
				};
			} else {
				transactionInput.data = {
					to: recipients[0].address,
					amount: recipients[0].amount.toHuman(),
					memo: smartbridge,
				};
			}

			const expiration = await wallet?.coin()?.transaction()?.estimateExpiration();
			if (expiration) {
				transactionInput.data.expiration = parseInt(expiration);
				setLastEstimatedExpiration(transactionInput.data.expiration);
			}

			const abortSignal = abortRef.current?.signal;
			const { uuid, transaction } = await transactionBuilder.build(
				transactionType,
				transactionInput,
				activeWallet,
				{
					abortSignal,
				},
			);

			const response = await activeWallet.transaction().broadcast(uuid);

			handleBroadcastError(response);

			await persist();

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

		if (activeTab === firstTabIndex) {
			return history.go(-1);
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
			await handleSubmit(() => submitForm(true))();
			return;
		}

		if (newIndex === 3 && senderWallet?.isLedger()) {
			handleSubmit(() => submitForm(true))();
		}

		setActiveTab(newIndex);
	};

	return (
		<Page profile={activeProfile}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={() => submitForm()}>
					<Tabs activeId={activeTab}>
						<StepIndicator
							size={showNetworkStep ? 5 : 4}
							activeIndex={showNetworkStep ? activeTab + 1 : activeTab}
						/>

						<div className="mt-8">
							<TabPanel tabId={0}>
								<NetworkStep profile={activeProfile} networks={networks} />
							</TabPanel>

							<TabPanel tabId={1}>
								<FormStep
									networks={networks}
									profile={activeProfile}
									deeplinkProps={deepLinkParams}
									hasWalletId={hasWalletId}
									disableNetworkField={showNetworkStep}
								/>
							</TabPanel>

							<TabPanel tabId={2}>
								<ReviewStep wallet={wallet!} />
							</TabPanel>

							<TabPanel tabId={3}>
								<AuthenticationStep
									wallet={wallet!}
									ledgerDetails={
										<TransferLedgerReview
											wallet={wallet!}
											estimatedExpiration={lastEstimatedExpiration}
										/>
									}
									ledgerIsAwaitingDevice={!hasDeviceAvailable}
									ledgerIsAwaitingApp={!isConnected}
								/>
							</TabPanel>

							<TabPanel tabId={4}>
								{!!transaction && <SummaryStep transaction={transaction} senderWallet={wallet!} />}
							</TabPanel>

							<TabPanel tabId={5}>
								<ErrorStep
									onBack={() =>
										history.push(`/profiles/${activeProfile.id()}/wallets/${wallet!.id()}`)
									}
									isRepeatDisabled={isSubmitting}
									onRepeat={handleSubmit(submitForm as any)}
								/>
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-3">
								{activeTab < 4 && (
									<>
										{activeTab < 3 && (
											<>
												<Button
													disabled={isSubmitting}
													data-testid="SendTransfer__button--back"
													variant="secondary"
													onClick={handleBack}
												>
													{t("COMMON.BACK")}
												</Button>
												<Button
													data-testid="SendTransfer__button--continue"
													disabled={
														activeTab === 0 && network ? false : !isValid || isSubmitting
													}
													onClick={async () => await handleNext()}
													isLoading={isSubmitting}
												>
													{t("COMMON.CONTINUE")}
												</Button>
											</>
										)}

										{activeTab === 3 && !wallet?.isLedger() && (
											<>
												<Button
													data-testid="SendTransfer__button--back"
													variant="secondary"
													onClick={handleBack}
												>
													{t("COMMON.BACK")}
												</Button>

												<Button
													type="submit"
													data-testid="SendTransfer__button--submit"
													disabled={!isValid || isSubmitting}
													icon="Send"
													isLoading={isSubmitting}
												>
													<span>{t("COMMON.SEND")}</span>
												</Button>
											</>
										)}
									</>
								)}

								{activeTab === 4 && (
									<Button
										data-testid="SendTransfer__button--back-to-wallet"
										variant="secondary"
										className="block"
										onClick={() =>
											history.push(`/profiles/${activeProfile.id()}/wallets/${wallet?.id()}`)
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

					<ConfirmSendTransaction
						unconfirmedTransactions={unconfirmedTransactions}
						isOpen={isConfirmModalOpen}
						onConfirm={() => {
							setIsConfirmModalOpen(false);
							handleSubmit(() => submitForm(true))();
						}}
						onClose={() => {
							setIsConfirmModalOpen(false);
						}}
					/>
				</Form>
			</Section>
		</Page>
	);
};
