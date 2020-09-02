import { Contracts } from "@arkecosystem/platform-sdk";
import { NetworkData, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputAddonEnd, InputGroup, InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { useClipboard } from "app/hooks";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { AddRecipient } from "domains/transaction/components/AddRecipient";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import { SendTransactionForm } from "domains/transaction/components/SendTransactionForm";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const FirstStep = ({ networks, profile }: { networks: NetworkData[]; profile: Profile }) => {
	const { t } = useTranslation();
	const { getValues, setValue } = useFormContext();
	const { recipients, smartbridge } = getValues();

	return (
		<section data-testid="TransactionSend__step--first">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">
					{t("TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.DESCRIPTION")}
				</div>
			</div>
			<div className="mt-8">
				<SendTransactionForm networks={networks} profile={profile}>
					<>
						<div data-testid="recipient-address">
							<AddRecipient
								maxAvailableAmount={80}
								profile={profile}
								onChange={(recipients: RecipientListItem[]) =>
									setValue("recipients", recipients, { shouldValidate: true })
								}
								recipients={recipients}
							/>
						</div>

						<FormField name="smartbridge" className="relative">
							<div className="mb-2">
								<FormLabel label="Smartbridge" />
							</div>
							<InputGroup>
								<Input
									data-testid="Input__smartbridge"
									type="text"
									placeholder=" "
									className="pr-24"
									maxLength={255}
									defaultValue={smartbridge}
									onChange={(event: any) =>
										setValue("smartbridge", event.target.value, { shouldValidate: true })
									}
								/>
								<InputAddonEnd>
									<button type="button" className="px-4 text-theme-neutral-light focus:outline-none">
										255 Max
									</button>
								</InputAddonEnd>
							</InputGroup>
						</FormField>
					</>
				</SendTransactionForm>
			</div>
		</section>
	);
};

export const SecondStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { getValues, unregister } = useFormContext();
	const { fee, recipients, smartbridge } = getValues();
	const coinName = wallet.coinId();

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
						{wallet.network().name()}
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

export const FifthStep = ({
	transaction,
	senderWallet,
}: {
	transaction: Contracts.SignedTransactionData;
	senderWallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
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
	const history = useHistory();

	const [activeTab, setActiveTab] = useState(1);
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);
	// eslint-disable-next-line
	const [_, copy] = useClipboard({
		resetAfter: 1000,
	});
	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const networks = useMemo(() => env.availableNetworks(), [env]);

	const form = useForm({ mode: "onChange" });
	const { clearErrors, formState, getValues, register, setError, setValue } = form;

	useEffect(() => {
		register("network", { required: true });
		register("recipients", { required: true, validate: (value) => Array.isArray(value) && value.length > 0 });
		register("senderAddress", { required: true });
		register("fee", { required: true });
		register("smartbridge");

		setValue("senderAddress", activeWallet.address(), { shouldValidate: true });

		for (const network of networks) {
			if (network.coin() === activeWallet.coinId() && network.id() === activeWallet.networkId()) {
				setValue("network", network, { shouldValidate: true });

				break;
			}
		}
	}, [activeWallet, networks, register, setValue]);

	const submitForm = async () => {
		clearErrors("mnemonic");

		const { fee, mnemonic, recipients, senderAddress, smartbridge } = getValues();
		const senderWallet = activeProfile.wallets().findByAddress(senderAddress);

		const isMultiPayment = recipients.length > 1;
		const transferInput = {
			fee,
			from: senderAddress,
			sign: {
				mnemonic,
			},
		};

		try {
			let transactionId: string;

			if (isMultiPayment) {
				transactionId = await senderWallet!.transaction().signMultiPayment({
					...transferInput,
					data: {
						payments: recipients.map(({ address, amount }: { address: string; amount: string }) => ({
							to: address,
							amount,
						})),
					},
				});
			} else {
				transactionId = await senderWallet!.transaction().signTransfer({
					...transferInput,
					data: {
						to: recipients[0].address,
						amount: recipients[0].amount,
						memo: smartbridge,
					},
				});
			}

			await senderWallet!.transaction().broadcast(transactionId);

			await env.persist();

			setTransaction(senderWallet!.transaction().transaction(transactionId));

			handleNext();
		} catch (error) {
			console.error("Could not create transaction: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", { type: "manual", message: t("TRANSACTION.INVALID_MNEMONIC") });
		}
	};

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
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
						<StepIndicator size={5} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep networks={networks} profile={activeProfile} />
							</TabPanel>

							<TabPanel tabId={2}>
								<SecondStep wallet={activeWallet} />
							</TabPanel>

							<TabPanel tabId={3}>
								<ThirdStep />
							</TabPanel>

							<TabPanel tabId={4}>
								<FifthStep transaction={transaction} senderWallet={activeWallet} />
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-3">
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
											className="block"
											onClick={() =>
												history.push(
													`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}`,
												)
											}
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
