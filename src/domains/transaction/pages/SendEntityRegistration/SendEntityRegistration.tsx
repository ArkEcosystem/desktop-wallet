import { Contracts } from "@arkecosystem/platform-sdk";
import { NetworkData, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputPassword } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { Select } from "app/components/SelectDropdown";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { SelectAddress } from "domains/profile/components/SelectAddress";
import { BusinessRegistrationForm } from "domains/transaction/components/BusinessRegistrationForm/BusinessRegistrationForm";
import { DelegateRegistrationForm } from "domains/transaction/components/DelegateRegistrationForm/DelegateRegistrationForm";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { SendEntityRegistrationForm, SendEntityRegistrationType } from "./SendEntityRegistration.models";

const registrationComponents: any = {
	delegateRegistration: DelegateRegistrationForm,
	businessRegistration: BusinessRegistrationForm,
};

const RegistrationTypeDropdown = ({ className, defaultValue, onChange, registrationTypes }: any) => {
	const { t } = useTranslation();

	return (
		<FormField data-testid="Registration__type" name="registrationType" className={`relative h-20 ${className}`}>
			<div className="mb-2">
				<FormLabel label={t("TRANSACTION.REGISTRATION_TYPE")} />
			</div>
			<div>
				<Select options={registrationTypes} defaultValue={defaultValue} onChange={onChange} />
			</div>
		</FormField>
	);
};

type FirstStepProps = {
	networks: NetworkData[];
	profile: Profile;
	wallet: ReadWriteWallet;
	setRegistrationForm: any;
	feeOptions: Record<string, any>;
};

export const FirstStep = ({ networks, profile, wallet, setRegistrationForm, feeOptions }: FirstStepProps) => {
	const { t } = useTranslation();
	const history = useHistory();

	const [wallets, setWallets] = useState<ReadWriteWallet[]>([]);

	const registrationTypes: SendEntityRegistrationType[] = [
		{
			value: "businessRegistration",
			label: "Business",
		},
	];

	if (!wallet.isDelegate()) {
		registrationTypes.push({
			value: "delegateRegistration",
			label: "Delegate",
		});
	}

	const form = useFormContext();
	const { setValue } = form;
	const { network, senderAddress, registrationType } = form.watch();

	useEffect(() => {
		if (network) {
			setWallets(profile.wallets().findByCoinWithNetwork(network.coin(), network.id()));
		}
	}, [network, profile]);

	const onSelectSender = (address: any) => {
		setValue("senderAddress", address, true);

		const wallet = wallets.find((wallet) => wallet.address() === address);
		history.push(`/profiles/${profile.id()}/wallets/${wallet!.id()}/sign-entity-registration`);
	};

	const onSelectType = (selectedItem: SendEntityRegistrationType) => {
		setValue("registrationType", selectedItem.value, true);
		setRegistrationForm(registrationComponents[selectedItem.value]);

		if (feeOptions[selectedItem.value]) {
			setValue("fee", feeOptions[selectedItem.value].average, true);
		}
	};

	return (
		<div data-testid="Registration__first-step">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_REGISTRATION.FIRST_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_REGISTRATION.FIRST_STEP.DESCRIPTION")}</div>

			<div className="mt-8 space-y-8">
				<FormField name="network" className="relative">
					<div className="mb-2">
						<FormLabel label="Network" />
					</div>
					<SelectNetwork id="SendTransactionForm__network" networks={networks} selected={network} disabled />
				</FormField>

				<FormField name="senderAddress" className="relative">
					<div className="mb-2">
						<FormLabel label="Sender" />
					</div>

					<div data-testid="sender-address">
						<SelectAddress
							address={senderAddress}
							wallets={wallets}
							disabled={wallets.length === 0}
							onChange={onSelectSender}
						/>
					</div>
				</FormField>

				<RegistrationTypeDropdown
					selectedType={registrationTypes.find(
						(type: SendEntityRegistrationType) => type.value === registrationType,
					)}
					registrationTypes={registrationTypes}
					onChange={onSelectType}
					className="mt-8"
				/>
			</div>
		</div>
	);
};

// TODO: Move to own component
export const SigningStep = ({
	passwordType,
	wallet,
}: {
	passwordType: "mnemonic" | "password" | "ledger";
	wallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();
	const { register } = useFormContext();

	return (
		<div data-testid="Registration__signing-step">
			{passwordType !== "ledger" && (
				<div>
					<h1 className="mb-0">{t("TRANSACTION.AUTHENTICATION_STEP.TITLE")}</h1>
					<div className="text-theme-neutral-dark">{t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}</div>

					<div className="mt-8">
						<FormField name={passwordType}>
							<FormLabel>
								{passwordType === "mnemonic"
									? t("TRANSACTION.MNEMONIC")
									: t("TRANSACTION.ENCRYPTION_PASSWORD")}
							</FormLabel>
							<InputPassword ref={register} />
							<FormHelperText />
						</FormField>

						{wallet.isSecondSignature() && (
							<FormField name="secondMnemonic" className="mt-8">
								<FormLabel>{t("TRANSACTION.SECOND_MNEMONIC")}</FormLabel>
								<InputPassword ref={register} />
								<FormHelperText />
							</FormField>
						)}
					</div>
				</div>
			)}

			{passwordType === "ledger" && (
				<div>
					<h1>{t("TRANSACTION.LEDGER_CONFIRMATION.TITLE")}</h1>
					<LedgerConfirmation />
				</div>
			)}
		</div>
	);
};

const FinalStep = ({
	registrationForm,
	transaction,
	senderWallet,
}: {
	registrationForm: any;
	transaction: Contracts.SignedTransactionData;
	senderWallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
			{registrationForm.transactionDetails && (
				<registrationForm.transactionDetails transaction={transaction} translations={t} />
			)}
		</TransactionSuccessful>
	);
};

export const SendEntityRegistration = () => {
	const { t } = useTranslation();
	const history = useHistory();

	const [activeTab, setActiveTab] = React.useState(1);
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);
	const [registrationForm, setRegistrationForm] = React.useState<SendEntityRegistrationForm>();

	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const networks = useMemo(() => env.availableNetworks(), [env]);

	const form = useForm({ mode: "onChange" });
	const { formState, getValues, register, setValue, unregister } = form;
	const { registrationType, senderAddress } = getValues();

	const [feeOptions, setFeeOptions] = useState<Record<string, any>>({});
	const stepCount = registrationForm ? registrationForm.tabSteps + 3 : 1;

	useEffect(() => {
		register("fee");
		register("network", { required: true });
		register("registrationType", { required: true });
		register("senderAddress", { required: true });
		setValue("senderAddress", activeWallet.address(), true);

		for (const network of networks) {
			if (network.coin() === activeWallet.coinId() && network.id() === activeWallet.networkId()) {
				setValue("network", network, true);

				break;
			}
		}
	}, [activeWallet, networks, register, setValue]);

	useEffect(() => {
		// TODO: shouldn't be necessary once SelectAddress returns wallets instead
		const senderWallet = activeProfile.wallets().findByAddress(senderAddress);

		try {
			const transactionFees = env.fees().all(senderWallet!.coinId(), senderWallet!.networkId());

			const fees = Object.entries(transactionFees).reduce((mapping, [transactionType, fees]) => {
				mapping[transactionType] = {
					last: undefined,
					min: fees.min,
					max: fees.max,
					average: fees.avg,
				};

				return mapping;
			}, {} as Record<string, any>);

			setFeeOptions(fees);
		} catch (error) {
			//
		}
	}, [env, setFeeOptions, setValue, activeProfile, senderAddress]);

	const submitForm = () =>
		registrationForm!.signTransaction({
			env,
			form,
			handleNext,
			profile: activeProfile,
			setTransaction,
			translations: t,
		});

	const handleBack = () => {
		setActiveTab(activeTab - 1);

		if (activeTab - 1 === 1) {
			for (const field of registrationForm!.formFields) {
				unregister(field);
			}
		}
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const crumbs = [
		{
			route: `/wallets/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form
					data-testid="Registration__form"
					className="max-w-xl mx-auto"
					context={form}
					onSubmit={submitForm}
				>
					<Tabs activeId={activeTab}>
						<StepIndicator size={stepCount} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep
									networks={networks}
									profile={activeProfile}
									wallet={activeWallet}
									setRegistrationForm={setRegistrationForm}
									feeOptions={feeOptions}
								/>
							</TabPanel>

							{activeTab > 1 && registrationForm && (
								<registrationForm.component
									activeTab={activeTab}
									feeOptions={feeOptions[registrationType]}
									wallet={activeWallet}
								/>
							)}

							{registrationForm && feeOptions[registrationType] && (
								<>
									<TabPanel tabId={stepCount - 1}>
										<SigningStep passwordType="mnemonic" wallet={activeWallet} />
									</TabPanel>
									<TabPanel tabId={stepCount}>
										<FinalStep
											transaction={transaction}
											registrationForm={registrationForm}
											senderWallet={activeWallet}
										/>
									</TabPanel>
								</>
							)}

							<div className="flex justify-end mt-8 space-x-3">
								{activeTab < 7 && (
									<Button
										disabled={activeTab === 1}
										data-testid="Registration__back-button"
										variant="plain"
										onClick={handleBack}
									>
										{t("COMMON.BACK")}
									</Button>
								)}

								{activeTab < 4 && (
									<Button
										data-testid="Registration__continue-button"
										disabled={!formState.isValid}
										onClick={handleNext}
									>
										{t("COMMON.CONTINUE")}
									</Button>
								)}

								{registrationForm && activeTab >= 4 && activeTab < stepCount && (
									<Button
										type="submit"
										data-testid="Registration__send-button"
										disabled={!formState.isValid}
										className="space-x-2"
									>
										<Icon name="Send" width={20} height={20} />
										<span>{t("COMMON.SEND")}</span>
									</Button>
								)}

								{registrationForm && activeTab === stepCount && (
									<div className="flex justify-end space-x-3">
										<Button
											data-testid="Registration__button--back-to-wallet"
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
											data-testid="Registration__download-button"
											variant="plain"
											className="space-x-2"
										>
											<Icon name="Download" />
											<span>{t("COMMON.DOWNLOAD")}</span>
										</Button>
									</div>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};
