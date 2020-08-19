import { Contracts } from "@arkecosystem/platform-sdk";
import { NetworkData, Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
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
import { DelegateRegistrationForm } from "domains/transaction/components/DelegateRegistrationForm/DelegateRegistrationForm";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { RegistrationForm, RegistrationType } from "./Registration.models";

const registrationComponents: any = {
	delegateRegistration: DelegateRegistrationForm,
};

const RegistrationTypeDropdown = ({ className, defaultValue, onChange, registrationTypes }: any) => {
	const { t } = useTranslation();

	return (
		<FormField data-testid="Registration__type" name="registrationType" className={`relative h-20 ${className}`}>
			<div className="mb-2">
				<FormLabel label={t("TRANSACTION.REGISTRATION_TYPE")} />
			</div>
			<div>
				<Select
					data-testid="Registration__type-select"
					options={registrationTypes}
					defaultValue={defaultValue}
					onChange={onChange}
				/>
			</div>
		</FormField>
	);
};

const getRegistrationByName = (registrationTypes: RegistrationType[], registrationType: string) =>
	registrationTypes.find((type: any) => type.value === registrationType);

const FirstStep = ({ networks, profile, wallet }: { networks: NetworkData[]; profile: Profile; wallet: Wallet }) => {
	const { t } = useTranslation();
	const history = useHistory();

	const [wallets, setWallets] = useState<Wallet[]>([]);

	const registrationTypes: RegistrationType[] = [
		{
			value: "business",
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
		history.push(`/profiles/${profile.id()}/transactions/${wallet!.id()}/registration/${registrationType}`);
	};

	const onSelectType = (selectedItem: any) => {
		setValue("registrationType", selectedItem.value, true);

		history.push(`/profiles/${profile.id()}/transactions/${wallet.id()}/registration/${selectedItem.value}`);
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
					selectedType={getRegistrationByName(registrationTypes, registrationType)}
					registrationTypes={registrationTypes}
					defaultValue={registrationType}
					onChange={onSelectType}
					className="mt-8"
				/>
			</div>
		</div>
	);
};

const SigningStep = ({
	passwordType,
	wallet,
}: {
	passwordType: "mnemonic" | "password" | "ledger";
	wallet: Wallet;
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
						<FormField name="name">
							<FormLabel>
								{passwordType === "mnemonic"
									? t("TRANSACTION.MNEMONIC")
									: t("TRANSACTION.ENCRYPTION_PASSWORD")}
							</FormLabel>
							<InputPassword name={passwordType} ref={register} />
						</FormField>

						{wallet.isSecondSignature() && (
							<FormField name="name" className="mt-8">
								<FormLabel>{t("TRANSACTION.SECOND_MNEMONIC")}</FormLabel>
								<InputPassword name="secondMnemonic" ref={register} />
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

const FinalStep = ({ registrationForm, transaction }: { registrationForm: any; transaction: any }) => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful transactionId={transaction.id()}>
			{registrationForm.transactionDetails && (
				<registrationForm.transactionDetails transaction={transaction} translations={t} />
			)}
		</TransactionSuccessful>
	);
};

export const Registration = () => {
	const { t } = useTranslation();
	const history = useHistory();

	const [activeTab, setActiveTab] = React.useState(1);
	const [transaction, setTransaction] = useState((null as unknown) as Contracts.SignedTransactionData);
	const [registrationForm, setRegistrationForm] = React.useState<RegistrationForm>();

	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const networks = useMemo(() => env.availableNetworks(), [env]);

	const form = useForm({ mode: "onChange" });
	const { formState, getValues, register, setValue } = form;
	const { registrationType, senderAddress } = getValues();

	const [feeOptions, setFeeOptions] = useState<Record<string, any>>({});
	const { registrationType: defaultRegistrationType } = useParams();
	const stepCount = registrationForm ? registrationForm.tabSteps + 3 : 1;

	useEffect(() => {
		register("fee");
		register("network", { required: true });
		register("registrationType", { required: true });
		register("senderAddress", { required: true });
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

	useEffect(() => {
		if (defaultRegistrationType) {
			setValue("registrationType", defaultRegistrationType, true);
		}
	}, [setValue, defaultRegistrationType]);

	useEffect(() => {
		const loadFees = async () => {
			// TODO: shouldn't be necessary once SelectAddress returns wallets instead
			const senderWallet = activeProfile.wallets().findByAddress(senderAddress);

			try {
				const fees = Object.entries(await senderWallet!.fee().all(7)).reduce(
					(mapping, [transactionType, fees]) => {
						mapping[transactionType] = {
							last: undefined,
							min: fees.min,
							max: fees.max,
							average: fees.avg,
						};

						return mapping;
					},
					{} as Record<string, any>,
				);

				setFeeOptions(fees);
			} catch (error) {
				//
			}
		};

		loadFees();
	}, [setFeeOptions, setValue, activeProfile, senderAddress]);

	useEffect(() => {
		if (registrationType) {
			setRegistrationForm(registrationComponents[registrationType]);

			if (feeOptions && feeOptions[registrationType]) {
				setValue("fee", feeOptions[registrationType].average, true);
			}
		}
	}, [feeOptions, registrationType, setValue]);

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
				<Form className="max-w-xl mx-auto" context={form} onSubmit={submitForm}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={stepCount} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep networks={networks} profile={activeProfile} wallet={activeWallet} />
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
										<FinalStep transaction={transaction} registrationForm={registrationForm} />
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
											data-testid="Registration__wallet-button"
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
											onClick={() => void 0}
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
