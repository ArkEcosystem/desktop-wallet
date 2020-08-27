import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputGroup } from "app/components/Input";
import { Label } from "app/components/Label";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { InputFee } from "domains/transaction/components/InputFee";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { RegistrationForm } from "domains/transaction/pages/Registration/Registration.models";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const SecondStep = ({ feeOptions, wallet }: any) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();

	const { getValues, register, setValue } = useFormContext();
	const username = getValues("username");
	const [delegates, setDelegates] = useState([]);
	const fee = getValues("fee") || null;

	useEffect(() => {
		setDelegates(env.coins().delegates(wallet.coinId(), wallet.networkId()));
	}, [env, wallet]);

	useEffect(() => {
		if (!username) {
			register("username", {
				required: true,
				validate: (value) => {
					if (!value.match(/^[a-z0-9!@$&_.]+$/)) {
						return t<string>("TRANSACTION.INVALID_DELEGATE_NAME");
					} else if (value.length > 20) {
						return t<string>("TRANSACTION.DELEGATE_NAME_TOO_LONG");
					} else if (delegates.find((delegate: any) => delegate.username === value)) {
						return t<string>("TRANSACTION.DELEGATE_NAME_EXISTS");
					}

					return true;
				},
			});
		}
	}, [delegates, register, username, t]);

	return (
		<section data-testid="DelegateRegistrationForm__step--second">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">
				{t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.DESCRIPTION")}
			</div>

			<div className="mt-4">
				<Alert>{t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.WARNING")}</Alert>

				<TransactionDetail
					className="mt-2"
					extra={<Avatar size="lg" address="ABUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}
					borderPosition="bottom"
				>
					<div className="mb-2 font-semibold text-theme-neutral">
						<span className="mr-1 text-sm">Sender</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} walletName={wallet.alias()} />
				</TransactionDetail>

				<FormField name="username" className="relative mt-8">
					<div className="mb-2">
						<FormLabel label={t("TRANSACTION.DELEGATE_NAME")} />
					</div>
					<InputGroup>
						<Input
							data-testid="Input__username"
							type="text"
							placeholder=" "
							className="pr-20"
							defaultValue={username}
							onChange={(event: any) => setValue("username", event.target.value, true)}
						/>
					</InputGroup>
					<FormHelperText />
				</FormField>

				<FormField name="fee" className="mt-8">
					<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
					<InputFee
						{...feeOptions}
						defaultValue={fee || 0}
						value={fee || 0}
						step={0.01}
						onChange={(value: any) => setValue("fee", value, true)}
					/>
				</FormField>
			</div>
		</section>
	);
};

const ThirdStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { getValues, unregister } = useFormContext();
	const { fee, username } = getValues();
	const coinName = wallet.manifest().get<string>("name");

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="DelegateRegistrationForm__step--third">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">
				{t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.DESCRIPTION")}
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

				<TransactionDetail
					label={t("TRANSACTION.DELEGATE_NAME")}
					className="pt-6"
					extra={
						<div className="mx-2">
							<Icon name="Delegate" width={32} height={32} />
						</div>
					}
				>
					{username}
				</TransactionDetail>

				<div className="mt-2">
					<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.make(fee)} />
				</div>
			</div>
		</section>
	);
};

const component = ({
	activeTab,
	feeOptions,
	wallet,
}: {
	activeTab: number;
	feeOptions: any;
	wallet: ReadWriteWallet;
}) => (
	<Tabs activeId={activeTab}>
		<TabPanel tabId={2}>
			<SecondStep feeOptions={feeOptions} wallet={wallet} />
		</TabPanel>
		<TabPanel tabId={3}>
			<ThirdStep wallet={wallet} />
		</TabPanel>
	</Tabs>
);

const transactionDetails = ({
	transaction,
	translations,
}: {
	transaction: Contracts.SignedTransactionData;
	translations: any;
}) => (
	<TransactionDetail label={translations("TRANSACTION.DELEGATE_NAME")}>
		{transaction.data().asset.delegate.username}
	</TransactionDetail>
);

component.displayName = "DelegateRegistrationForm";
transactionDetails.displayName = "DelegateRegistrationFormTransactionDetails";

export const DelegateRegistrationForm: RegistrationForm = {
	tabSteps: 2,
	component,
	transactionDetails,
	formFields: ["username"],

	signTransaction: async ({ env, form, handleNext, profile, setTransaction, translations }: any) => {
		const { clearError, getValues, setError, setValue } = form;

		clearError("mnemonic");
		const { fee, mnemonic, senderAddress, username } = getValues();
		const senderWallet = profile.wallets().findByAddress(senderAddress);

		try {
			const transactionId = await senderWallet.transaction().signDelegateRegistration({
				fee,
				from: senderAddress,
				sign: {
					mnemonic,
				},
				data: {
					username,
				},
			});

			await senderWallet.transaction().broadcast([transactionId]);

			await env.persist();

			setTransaction(senderWallet.transaction().transaction(transactionId));

			handleNext();
		} catch (error) {
			console.error("Could not create transaction: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", "manual", translations("TRANSACTION.INVALID_MNEMONIC"));
		}
	},
};
