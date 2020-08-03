import { Address } from "app/components/Address";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Page, Section } from "app/components/Layout";
import { useSelectionState } from "app/components/SelectionBar";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useActiveProfile } from "app/hooks/env";
import { InputFee } from "domains/transaction/components/InputFee";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type ResignRegistrationProps = {
	formDefaultData?: any;
	onDownload: any;
};

const FirstStep = () => {
	const selectionBarState = useSelectionState(1);

	const { t } = useTranslation();

	return (
		<div data-testid="ResignRegistration__first-step">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.TITLE")}</h1>
			<div className="text-theme-neutral-dark">
				{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.DESCRIPTION")}
			</div>

			<div className="mt-6">
				<Alert size="lg">{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.WARNING")}</Alert>
			</div>

			<div>
				<TransactionDetail
					extra={<Avatar size="lg" address="BAUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}
					border={false}
				>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>Delegate 3</TransactionDetail>

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="name" className="font-normal">
						<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
						<InputFee selectionBarState={selectionBarState} defaultValue={25} min={1} max={100} step={1} />
					</FormField>
				</TransactionDetail>
			</div>
		</div>
	);
};

const SecondStep = () => {
	const { t } = useTranslation();

	return (
		<div data-testid="ResignRegistration__second-step">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.SECOND_STEP.TITLE")}</h1>
				<p className="text-theme-neutral-dark">
					{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.SECOND_STEP.DESCRIPTION")}
				</p>
			</div>
			<div className="mt-4 grid grid-flow-row gap-2">
				<TransactionDetail
					border={false}
					label={t("TRANSACTION.NETWORK")}
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-light" size="lg">
								<Icon name="Ark" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					<div className="flex-auto font-semibold truncate text-theme-neutral-800 max-w-24">
						ARK Ecosystem
					</div>
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address="BAUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>Delegate 3</TransactionDetail>

				<div className="my-4">
					<TotalAmountBox transactionAmount="0.00" transactionFee="0.09660435" />
				</div>
			</div>
		</div>
	);
};

const ThirdStep = ({ form, passwordType }: { form: any; passwordType: "mnemonic" | "password" | "ledger" }) => {
	const { register } = form;

	const { t } = useTranslation();

	return (
		<div data-testid="ResignRegistration__third-step">
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

						{passwordType === "mnemonic" && (
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

export const FourthStep = () => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful>
			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_TYPE")}
				extra={
					<Circle className="border-black" size="lg">
						<Icon name="Business" width={20} height={20} />
					</Circle>
				}
			>
				Delegate Resignation
			</TransactionDetail>
			<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>Delegate 3</TransactionDetail>
			<TransactionDetail
				label={t("TRANSACTION.AMOUNT")}
				extra={
					<div className="ml-1 text-theme-danger">
						<Circle className="bg-theme-background border-theme-danger-light" size="lg">
							<Icon name="Sent" width={22} height={22} />
						</Circle>
					</div>
				}
			>
				1.09660435 ARK
			</TransactionDetail>
		</TransactionSuccessful>
	);
};

export const ResignRegistration = ({ formDefaultData, onDownload }: ResignRegistrationProps) => {
	const [activeTab, setActiveTab] = React.useState(1);

	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });
	const { formState } = form;
	const { isValid } = formState;

	const activeProfile = useActiveProfile();

	const { t } = useTranslation();

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: "Go back to Portfolio",
		},
	];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={(data: any) => onDownload(data)}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={6} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep />
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep form={form} passwordType="mnemonic" />
							</TabPanel>
							<TabPanel tabId={4}>
								<ThirdStep form={form} passwordType="password" />
							</TabPanel>
							<TabPanel tabId={5}>
								<ThirdStep form={form} passwordType="ledger" />
							</TabPanel>
							<TabPanel tabId={6}>
								<FourthStep />
							</TabPanel>

							<div className="flex justify-end mt-8 space-x-3">
								{activeTab < 6 && (
									<Button
										disabled={activeTab === 1}
										data-testid="ResignRegistration__back-button"
										variant="plain"
										onClick={handleBack}
									>
										{t("COMMON.BACK")}
									</Button>
								)}

								{activeTab < 3 && (
									<Button
										data-testid="ResignRegistration__continue-button"
										disabled={!isValid}
										onClick={handleNext}
									>
										{t("COMMON.CONTINUE")}
									</Button>
								)}

								{activeTab >= 3 && activeTab < 6 && (
									<Button
										data-testid="ResignRegistration__send-button"
										disabled={!isValid}
										onClick={handleNext}
										className="space-x-2"
									>
										<Icon name="Send" width={20} height={20} />
										<span>{t("COMMON.SEND")}</span>
									</Button>
								)}

								{activeTab === 6 && (
									<div className="flex justify-end space-x-3">
										<Button data-testid="ResignRegistration__wallet-button" variant="plain">
											{t("COMMON.BACK_TO_WALLET")}
										</Button>

										<Button
											type="submit"
											data-testid="ResignRegistration__download-button"
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

ResignRegistration.defaultProps = {
	formDefaultData: {},
};
