import { Contracts } from "@arkecosystem/platform-sdk";
import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { useClipboard } from "app/hooks";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { SendTransactionForm } from "domains/transaction/components/SendTransactionForm";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FirstStep = ({ networks, profile, wallets }: any) => {
	const { t } = useTranslation();

	return (
		<section data-testid="TransactionSend__step--first">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">
					{t("TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.DESCRIPTION")}
				</div>
			</div>
			<div className="mt-8">
				<SendTransactionForm networks={networks} profile={profile} />
			</div>
		</section>
	);
};

export const SecondStep = ({ profile }: any) => {
	const { t } = useTranslation();
	const { getValues, unregister } = useFormContext();
	const { fee, recipients, senderAddress, smartbridge } = getValues();
	const wallet: Wallet = profile.wallets().findByAddress(senderAddress);
	const coinName = wallet.manifest().get<string>("name");

	let amount = BigNumber.ZERO;
	for (const recipient of recipients) {
		amount = amount.plus(recipient.amount);
	}

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="TransactionSend__step--second">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_TRANSACTION_SEND.SECOND_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">
					{t("TRANSACTION.PAGE_TRANSACTION_SEND.SECOND_STEP.DESCRIPTION")}
				</div>
			</div>

			<div className="mt-4 grid grid-flow-row gap-2">
				<TransactionDetail
					border={false}
					label={t("TRANSACTION.NETWORK")}
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-light" size="lg">
								{coinName && <Icon name={upperFirst(coinName.toLowerCase())} width={20} height={20} />}
							</Circle>
						</div>
					}
				>
					<div className="flex-auto font-semibold truncate text-md text-theme-neutral-800 max-w-24">
						{wallet.network().name}
					</div>
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address="ABUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}>
					<div className="mb-2 font-semibold text-theme-neutral">
						<span className="mr-1 text-sm">Sender</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} walletName={wallet.alias()} />
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.RECIPIENTS")} className="py-6">
					<RecipientList recipients={recipients} assetSymbol="ARK" isEditable={false} />
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.SMARTBRIDGE")}
					className="pt-6"
					extra={
						<div className="mx-2">
							<Icon name="Smartbridge" width={32} height={32} />
						</div>
					}
				>
					{smartbridge}
				</TransactionDetail>

				<div className="mt-2">
					<TotalAmountBox amount={amount} fee={BigNumber.make(fee)} />
				</div>
			</div>
		</section>
	);
};

export const ThirdStep = () => {
	const { register } = useFormContext();
	const { t } = useTranslation();

	return (
		<section data-testid="TransactionSend__step--third">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.AUTHENTICATION_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">{t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}</div>

				<div className="grid grid-flow-row">
					<FormField name="mnemonic" className="pt-8 pb-0">
						<FormLabel>{t("TRANSACTION.MNEMONIC")}</FormLabel>
						<InputPassword ref={register({ required: true })} />
						<FormHelperText />
					</FormField>
				</div>
			</div>
		</section>
	);
};

export const FourthStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="TransactionSend__step--fourth">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.LEDGER_CONFIRMATION.TITLE")}</h1>
				<LedgerConfirmation />
			</div>
		</section>
	);
};

export const FifthStep = ({ transaction }: { transaction: Contracts.TransactionData }) => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful transactionId={transaction.id()}>
			<TransactionDetail
				label={t("TRANSACTION.AMOUNT")}
				className="pb-0"
				extra={
					<div className="ml-1 text-theme-danger">
						<Circle className="bg-theme-background border-theme-danger-light" size="lg">
							<Icon name="Sent" width={22} height={22} />
						</Circle>
					</div>
				}
			>
				{transaction.amount().toHuman(8)}
			</TransactionDetail>
		</TransactionSuccessful>
	);
};

export const TransactionSend = () => {
	const { t } = useTranslation();

	const [activeTab, setActiveTab] = useState(1);
	const [transaction, setTransaction] = useState<Contracts.TransactionData>(
		(null as unknown) as Contracts.TransactionData,
	);
	// eslint-disable-next-line
	const [_, copy] = useClipboard({
		resetAfter: 1000,
	});
	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const networks = useMemo(() => env.availableNetworks(), [env]);

	const form = useForm({
		mode: "onChange",
	});
	const { clearError, formState, getValues, register, setError, setValue } = form;

	useEffect(() => {
		register("network", { required: true });
		register("recipients", { required: true, validate: (value) => Array.isArray(value) && value.length > 0 });
		register("senderAddress", { required: true });
		register("fee", { required: true });
		register("smartbridge");

		setValue("senderAddress", activeWallet.address(), true);

		for (const network of networks) {
			if (
				network.id() === activeWallet.network().id &&
				network.coin() === activeWallet.manifest().get<string>("name")
			) {
				setValue("network", network, true);

				break;
			}
		}
	}, [activeWallet, networks, register, setValue]);

	const submitForm = async () => {
		clearError("mnemonic");
		const { fee, mnemonic, recipients, senderAddress, smartbridge } = getValues();
		const senderWallet = activeProfile.wallets().findByAddress(senderAddress);

		try {
			const transactionId = await senderWallet!.transaction().signTransfer({
				fee,
				from: senderAddress,
				sign: {
					mnemonic,
				},
				data: {
					amount: recipients[0].amount,
					to: recipients[0].address,
					memo: smartbridge,
				},
			});

			await senderWallet!.transaction().broadcast([transactionId]);

			await env.persist();

			// TODO: Remove timer and figure out a nicer way of doing this
			const intervalId = setInterval(async () => {
				try {
					const transactionData = await senderWallet!.client().transaction(transactionId);
					setTransaction(transactionData);
					clearInterval(intervalId);

					handleNext();
				} catch (error) {
					// eslint-disable no-empty
				}
			}, 500);
		} catch (error) {
			console.error("Could not create transaction: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", "manual", t("TRANSACTION.INVALID_MNEMONIC"));
		}
	};

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const copyTransaction = () => {
		copy(JSON.stringify(transaction.toObject(), undefined, 2));
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
						<StepIndicator size={5} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep networks={networks} profile={activeProfile} />
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep profile={activeProfile} />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep />
							</TabPanel>
							<TabPanel tabId={4}>
								<FifthStep transaction={transaction} />
							</TabPanel>

							<div className="flex justify-end mt-8 space-x-3">
								{activeTab < 4 && (
									<>
										<Button
											disabled={activeTab === 1}
											data-testid="TransactionSend__button--back"
											variant="plain"
											onClick={handleBack}
										>
											{t("COMMON.BACK")}
										</Button>

										{activeTab < 3 && (
											<Button
												data-testid="TransactionSend__button--continue"
												disabled={!formState.isValid}
												onClick={handleNext}
											>
												{t("COMMON.CONTINUE")}
											</Button>
										)}

										{activeTab === 3 && (
											<Button
												type="submit"
												data-testid="TransactionSend__button--submit"
												disabled={!formState.isValid}
											>
												{t("TRANSACTION.SIGN_CONTINUE")}
											</Button>
										)}
									</>
								)}

								{activeTab === 4 && (
									<>
										<Button
											data-testid="TransactionSend__button--back-to-wallet"
											variant="plain"
											className={"block"}
										>
											{t("COMMON.BACK_TO_WALLET")}
										</Button>
										<Button
											onClick={copyTransaction}
											data-testid="TransactionSend__button--copy"
											variant="plain"
											className="space-x-2"
										>
											<Icon name="Copy" />
											<span>{t("COMMON.COPY")}</span>
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
