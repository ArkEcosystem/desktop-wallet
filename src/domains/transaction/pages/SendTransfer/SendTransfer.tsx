import { Contracts } from "@arkecosystem/platform-sdk";
import { ExtendedTransactionData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext, useLedgerContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useValidation } from "app/hooks";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import { ConfirmSendTransaction } from "domains/transaction/components/ConfirmSendTransaction";
import { ErrorStep } from "domains/transaction/components/ErrorStep";
import { FeeWarning } from "domains/transaction/components/FeeWarning";
import { useFeeConfirmation, useTransaction, useTransactionBuilder } from "domains/transaction/hooks";
import { isMnemonicError } from "domains/transaction/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";

import { FormStep, ReviewStep, SummaryStep } from "./";
import { TransferLedgerReview } from "./LedgerReview";

export const SendTransfer = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const location = useLocation();
	const { walletId: hasWalletId } = useParams();
	const { state } = location;

	const [activeTab, setActiveTab] = useState(1);
	const [unconfirmedTransactions, setUnconfirmedTransactions] = useState([] as ExtendedTransactionData[]);
	const [isConfirming, setIsConfirming] = useState(false);
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);

	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const [wallet, setWallet] = useState<ReadWriteWallet | undefined>(hasWalletId ? activeWallet : undefined);
	const networks = useMemo(() => env.availableNetworks(), [env]);

	const form = useForm({
		mode: "onChange",
		defaultValues: {
			fee: 0,
			amount: 0,
			remainingBalance: wallet?.balance?.(),
			recipients: [],
		},
		shouldUnregister: false,
	});

	const { clearErrors, formState, getValues, register, setError, setValue, handleSubmit, watch } = form;
	const { isValid, isSubmitting } = formState;

	const { senderAddress, fees, fee, remainingBalance, amount, isSendAllSelected } = watch();
	const { sendTransfer, common } = useValidation();

	const { hasDeviceAvailable, isConnected } = useLedgerContext();

	const abortRef = useRef(new AbortController());
	const transactionBuilder = useTransactionBuilder(activeProfile);
	const { fetchWalletUnconfirmedTransactions } = useTransaction();

	useEffect(() => {
		register("remainingBalance");
		register("network", sendTransfer.network());
		register("recipients");
		register("senderAddress", sendTransfer.senderAddress());
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
		if (!hasWalletId && senderAddress) {
			const wallet = activeProfile.wallets().findByAddress(senderAddress);
			setWallet(wallet);
		}
	}, [activeProfile, hasWalletId, senderAddress]);

	useEffect(() => {
		if (!state) {
			return;
		}

		setValue(
			"network",
			networks.find((item) => item.coin().toLowerCase() === state.coin && item.id() === state.network),
		);

		if (state.memo) {
			setValue("smartbridge", state.memo);
		}
	}, [state, setValue, networks]);

	useEffect(() => {
		if (!wallet?.address?.()) {
			return;
		}

		setValue("senderAddress", wallet.address(), { shouldValidate: true, shouldDirty: true });

		for (const network of networks) {
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

	const submitForm = async () => {
		clearErrors("mnemonic");

		const { fee, mnemonic, secondMnemonic, recipients, senderAddress, smartbridge } = getValues();

		const isMultiPayment = recipients.length > 1;

		const transactionType = isMultiPayment ? "multiPayment" : "transfer";
		const transactionInput: Contracts.TransactionInputs = {
			fee,
			from: senderAddress,
			sign: {
				mnemonic,
				secondMnemonic,
			},
			data: {},
		};

		try {
			if (isMultiPayment) {
				transactionInput.data = {
					payments: recipients.map(({ address, amount }: { address: string; amount: string }) => ({
						to: address,
						amount,
					})),
				};
			} else {
				transactionInput.data = {
					to: recipients[0].address,
					amount: recipients[0].amount,
					memo: smartbridge,
				};
			}

			const expiration = await wallet?.coin()?.transaction().estimateExpiration();
			transactionInput.data.expiration = parseInt(expiration!);

			const abortSignal = abortRef.current?.signal;
			const { uuid, transaction } = await transactionBuilder.build(transactionType, transactionInput, {
				abortSignal,
			});

			await transactionBuilder.broadcast(uuid, transactionInput);

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

		if (activeTab === 1) {
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
			await handleSubmit(submitForm)();
			return;
		}

		if (newIndex === 3 && senderWallet?.isLedger()) {
			handleSubmit(submitForm)();
		}

		setActiveTab(newIndex);
	};

	return (
		<Page profile={activeProfile}>
			<Section className="flex-1">
				<Form className="mx-auto max-w-xl" context={form} onSubmit={submitForm}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FormStep
									networks={networks}
									profile={activeProfile}
									deeplinkProps={state}
									hasWalletId={hasWalletId}
								/>
							</TabPanel>

							<TabPanel tabId={2}>
								<ReviewStep wallet={wallet!} />
							</TabPanel>

							<TabPanel tabId={3}>
								<AuthenticationStep
									wallet={wallet!}
									ledgerDetails={<TransferLedgerReview wallet={wallet!} />}
									ledgerIsAwaitingDevice={!hasDeviceAvailable}
									ledgerIsAwaitingApp={!isConnected}
								/>
							</TabPanel>

							<TabPanel tabId={4}>
								<SummaryStep transaction={transaction} senderWallet={wallet!} />
							</TabPanel>

							<TabPanel tabId={5}>
								<ErrorStep
									onBack={() =>
										history.push(`/profiles/${activeProfile.id()}/wallets/${wallet!.id()}`)
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
													disabled={isSubmitting}
													data-testid="SendTransfer__button--back"
													variant="secondary"
													onClick={handleBack}
												>
													{t("COMMON.BACK")}
												</Button>
												<Button
													data-testid="SendTransfer__button--continue"
													disabled={!isValid || isSubmitting}
													onClick={async () => await handleNext()}
													isLoading={isSubmitting || isConfirming}
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
													onClick={async () => {
														setIsConfirming(true);

														const unconfirmed = await fetchWalletUnconfirmedTransactions(
															wallet!,
														);

														setUnconfirmedTransactions(unconfirmed);

														if (unconfirmed.length > 0) {
															return;
														}

														handleSubmit(submitForm)();
													}}
													data-testid="SendTransfer__button--submit"
													disabled={!isValid || isSubmitting || isConfirming}
													icon="Send"
													isLoading={isSubmitting || isConfirming}
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
						isOpen={unconfirmedTransactions.length > 0}
						onConfirm={() => {
							handleSubmit(submitForm)();
							setUnconfirmedTransactions([]);
						}}
						onClose={() => {
							setIsConfirming(false);
							setUnconfirmedTransactions([]);
						}}
					/>
				</Form>
			</Section>
		</Page>
	);
};
