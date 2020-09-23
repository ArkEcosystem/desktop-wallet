import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Label } from "app/components/Label";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { useValidation } from "app/hooks/validations";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { InputFee } from "domains/transaction/components/InputFee";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { SendEntityRegistrationForm } from "domains/transaction/pages/SendEntityRegistration/SendEntityRegistration.models";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const SecondStep = ({ fees, wallet }: any) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();

	const { delegateRegistration } = useValidation();

	const { getValues, register, setValue, watch } = useFormContext();
	const username = getValues("username");
	const [delegates, setDelegates] = useState<ReadOnlyWallet[]>([]);

	// getValues does not get the value of `defaultValues` on first render
	const [defaultFee] = useState(() => watch("fee"));
	const fee = getValues("fee") || defaultFee;

	useEffect(() => {
		setDelegates(env.delegates().all(wallet.coinId(), wallet.networkId()));
	}, [env, wallet]);

	useEffect(() => {
		if (!username) {
			register("username", {
				...delegateRegistration.username(),
				validate: (value) => (
						!delegates.some((delegate: ReadOnlyWallet) => delegate.username() === value) ||
						t("COMMON.VALIDATION.EXISTS", { field: t("COMMON.DELEGATE_NAME") }).toString()
					),
			});
		}
	}, [delegateRegistration, delegates, register, username, t]);

	return (
		<section data-testid="DelegateRegistrationForm__step--second">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.TITLE")}</h1>

			<div className="text-theme-neutral-dark">
				{t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.DESCRIPTION")}
			</div>

			<div className="mt-6">
				<Alert>{t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.WARNING")}</Alert>

				<TransactionDetail
					className="mt-2"
					extra={<Avatar size="lg" address={wallet.address()} />}
					borderPosition="bottom"
				>
					<div className="flex-1 space-y-2">
						<div className="text-theme-neutral">
							<span className="mr-1 text-sm">{t("TRANSACTION.SENDER")}</span>
							<Label color="warning">
								<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
							</Label>
						</div>
						<Address address={wallet.address()} walletName={wallet.alias()} />
					</div>
				</TransactionDetail>

				<div className="relative mt-8 space-y-8">
					<FormField name="username">
						<FormLabel label={t("TRANSACTION.DELEGATE_NAME")} />
						<Input
							data-testid="Input__username"
							className="pr-20"
							defaultValue={username}
							onChange={(event: any) =>
								setValue("username", event.target.value, { shouldValidate: true, shouldDirty: true })
							}
						/>
						<FormHelperText />
					</FormField>

					<FormField name="fee">
						<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
						<InputFee
							min={fees.min}
							avg={fees.avg}
							max={fees.max}
							defaultValue={fee || 0}
							value={fee || 0}
							step={0.01}
							onChange={(value: any) =>
								setValue("fee", value, { shouldValidate: true, shouldDirty: true })
							}
						/>
					</FormField>
				</div>
			</div>
		</section>
	);
};

const ThirdStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { getValues, unregister } = useFormContext();
	const { fee, username } = getValues();

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="DelegateRegistrationForm__step--third">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.TITLE")}</h1>

			<div className="text-theme-neutral-dark">
				{t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.DESCRIPTION")}
			</div>

			<TransactionDetail
				border={false}
				label={t("TRANSACTION.NETWORK")}
				extra={<NetworkIcon size="lg" coin={wallet.network().coin()} network={wallet.network().id()} />}
			>
				{wallet.network().name()}
			</TransactionDetail>

			<TransactionDetail extra={<Avatar size="lg" address={wallet.address()} />}>
				<div className="flex-1 space-y-2">
					<div className="text-theme-neutral">
						<span className="mr-1 text-sm">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} walletName={wallet.alias()} />
				</div>
			</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.DELEGATE_NAME")}
				extra={
					<Circle className="bg-theme-background border-theme-text" size="lg">
						<Icon name="Delegate" width={20} height={25} />
					</Circle>
				}
			>
				{username}
			</TransactionDetail>

			<div className="mt-2">
				<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.make(fee)} />
			</div>
		</section>
	);
};

const component = ({ activeTab, fees, wallet }: { activeTab: number; fees: any; wallet: ReadWriteWallet }) => (
	<Tabs activeId={activeTab}>
		<TabPanel tabId={2}>
			<SecondStep fees={fees} wallet={wallet} />
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

export const DelegateRegistrationForm: SendEntityRegistrationForm = {
	tabSteps: 2,
	component,
	transactionDetails,
	formFields: ["username"],

	signTransaction: async ({ env, form, handleNext, profile, setTransaction, translations }: any) => {
		const { clearErrors, getValues, setError, setValue } = form;

		clearErrors("mnemonic");
		const { fee, mnemonic, secondMnemonic, senderAddress, username } = getValues();
		const senderWallet = profile.wallets().findByAddress(senderAddress);

		try {
			const transactionId = await senderWallet.transaction().signDelegateRegistration({
				fee,
				from: senderAddress,
				sign: {
					mnemonic,
					secondMnemonic,
				},
				data: {
					username,
				},
			});

			await senderWallet.transaction().broadcast(transactionId);

			await env.persist();

			setTransaction(senderWallet.transaction().transaction(transactionId));

			handleNext();
		} catch (error) {
			console.error("Could not create transaction: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", { type: "manual", message: translations("TRANSACTION.INVALID_MNEMONIC") });
		}
	},
};
