import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { Spinner } from "app/components/Spinner";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useClipboard, useValidation } from "app/hooks";
import { AuthenticationStep } from "domains/transaction/components/AuthenticationStep";
import { useTransactionBuilder } from "domains/transaction/hooks/use-transaction-builder";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";

import { FormStep } from "./Step1";
import { ReviewStep } from "./Step2";
import { SummaryStep } from "./Step4";
// import { BigNumber } from "@arkecosystem/platform-sdk-support";

export const SendTransfer = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const location = useLocation();
	const { walletId: hasWalletId } = useParams();
	const { state } = location;

	const [activeTab, setActiveTab] = useState(1);
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);
	// eslint-disable-next-line
	const [_, copy] = useClipboard({
		resetAfter: 1000,
	});
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
		},
		shouldUnregister: false,
	});

	const { clearErrors, formState, getValues, register, setError, setValue, handleSubmit, watch } = form;
	const { isValid, isSubmitting } = formState;

	const { senderAddress, fees, remainingBalance, amount } = watch();
	const { sendTransfer, common } = useValidation();
	const transactionBuilder = useTransactionBuilder(activeProfile);

	useEffect(() => {
		register("remainingBalance");
		register("network", sendTransfer.network());
		register("recipients");
		register("senderAddress", sendTransfer.senderAddress());
		register("fee", common.fee(fees, remainingBalance, wallet?.network?.()));
		register("smartbridge", sendTransfer.smartbridge());
	}, [register, sendTransfer, common, fees, wallet, remainingBalance, amount, senderAddress]);

	useEffect(() => {
		if (!hasWalletId && senderAddress) {
			const wallet = activeProfile.wallets().findByAddress(senderAddress);
			setWallet(wallet);
		}
	}, [activeProfile, hasWalletId, senderAddress]);

	useEffect(() => {
		if (!wallet?.address?.()) return;

		setValue("senderAddress", wallet.address(), { shouldValidate: true, shouldDirty: true });

		for (const network of networks) {
			if (network.coin() === wallet.coinId() && network.id() === wallet.networkId()) {
				setValue("network", network, { shouldValidate: true, shouldDirty: true });

				break;
			}
		}
	}, [wallet, networks, setValue]);

	useEffect(() => {
		if (state?.memo) setValue("smartbridge", state.memo);
	}, [state, setValue]);

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

			const transaction = await transactionBuilder.build(transactionType, transactionInput);
			await transactionBuilder.broadcast(transaction.id(), transactionInput);

			await env.persist();

			setTransaction(transaction);
			setActiveTab(4);
		} catch (error) {
			console.error("Could not create transaction: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", { type: "manual", message: t("TRANSACTION.INVALID_MNEMONIC") });
		}
	};

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = async () => {
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

	const copyTransaction = () => {
		copy(transaction.id());
	};

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={submitForm}>
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
								<AuthenticationStep wallet={wallet!} />
							</TabPanel>

							<TabPanel tabId={4}>
								<SummaryStep transaction={transaction} senderWallet={wallet!} />
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-3">
								{activeTab < 4 && (
									<>
										<Button
											disabled={activeTab === 1}
											data-testid="SendTransfer__button--back"
											variant="plain"
											onClick={handleBack}
										>
											{t("COMMON.BACK")}
										</Button>

										{activeTab < 3 && (
											<Button
												data-testid="SendTransfer__button--continue"
												disabled={!isValid || isSubmitting}
												onClick={handleNext}
											>
												{isSubmitting ? <Spinner size="sm" /> : t("COMMON.CONTINUE")}
											</Button>
										)}

										{activeTab === 3 && (
											<Button
												type="submit"
												data-testid="SendTransfer__button--submit"
												disabled={!isValid || isSubmitting}
												className="space-x-2"
											>
												<Icon name="Send" width={20} height={20} />
												{isSubmitting ? <Spinner size="sm" /> : <span>{t("COMMON.SEND")}</span>}
											</Button>
										)}
									</>
								)}

								{activeTab === 4 && (
									<>
										<Button
											data-testid="SendTransfer__button--back-to-wallet"
											variant="plain"
											className="block"
											onClick={() =>
												history.push(`/profiles/${activeProfile.id()}/wallets/${wallet?.id()}`)
											}
										>
											{t("COMMON.BACK_TO_WALLET")}
										</Button>

										<Button
											onClick={copyTransaction}
											data-testid="SendTransfer__button--copy"
											variant="plain"
											className="space-x-2"
										>
											<Icon name="Copy" />
											<span>{t("COMMON.COPY_TRANSACTION_ID")}</span>
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
