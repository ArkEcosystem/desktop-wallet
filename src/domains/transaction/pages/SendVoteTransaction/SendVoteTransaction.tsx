import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useActiveProfile } from "app/hooks/env";
import { InputFee } from "domains/transaction/components/InputFee";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FirstStep = () => {
	const { register } = useFormContext();
	const { t } = useTranslation();

	useEffect(() => {
		register("fee", { required: true });
	}, [register]);

	return (
		<section data-testid="SendVoteTransaction__step--first">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_VOTE.FIRST_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_VOTE.FIRST_STEP.DESCRIPTION")}</div>

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
					ARK Ecosystem
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address="AEUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.DELEGATE")}
					extra={<Avatar size="lg" address="AEUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"Delegate 3"} />
				</TransactionDetail>

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="fee">
						<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
						<InputFee
							defaultValue={(25 * 1e8).toFixed(0)}
							min={(1 * 1e8).toFixed(0)}
							max={(100 * 1e8).toFixed(0)}
							step={1}
						/>
					</FormField>
				</TransactionDetail>
			</div>
		</section>
	);
};

export const SecondStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="SendVoteTransaction__step--second">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_VOTE.SECOND_STEP.TITLE")}</h1>
				<p className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_VOTE.SECOND_STEP.DESCRIPTION")}</p>
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
					ARK Ecosystem
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address="AEUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.DELEGATE")}
					extra={<Avatar size="lg" address="AEUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"Delegate 3"} />
				</TransactionDetail>

				<div className="my-4">
					<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.ZERO} />
				</div>
			</div>
		</section>
	);
};

export const ThirdStep = ({ form, passwordType }: { form: any; passwordType: "mnemonic" | "password" | "ledger" }) => {
	const { register } = form;

	const { t } = useTranslation();

	return (
		<div data-testid="SendVoteTransaction__step--third">
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
				label={t("TRANSACTION.DELEGATE")}
				extra={<Avatar size="lg" address="AEUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}
			>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"Delegate 3"} />
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>0.09660435 ARK</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_TYPE")}
				className="pb-0"
				extra={
					<div className="ml-1 text-theme-neutral-900">
						<Circle className="border-theme-neutral-900 bg-theme-background" size="lg">
							<Icon name="Voted" />
						</Circle>
					</div>
				}
			>
				{t("TRANSACTION.TRANSACTION_TYPES.VOTE")}
			</TransactionDetail>
		</TransactionSuccessful>
	);
};

type Props = {
	onCopy: () => void;
	onSubmit: () => void;
};

export const SendVoteTransaction = ({ onCopy, onSubmit }: Props) => {
	const [activeTab, setActiveTab] = React.useState(1);

	const form = useForm({ mode: "onChange" });
	// const { formState } = form;
	// const { isValid } = formState;

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
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={onSubmit}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

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
								<FourthStep />
							</TabPanel>

							<div className="flex justify-end mt-8 space-x-3">
								{activeTab < 4 && (
									<>
										<Button
											disabled={activeTab === 1}
											data-testid="SendVoteTransaction__button--back"
											variant="plain"
											onClick={handleBack}
										>
											{t("COMMON.BACK")}
										</Button>
										<Button
											data-testid="SendVoteTransaction__button--continue"
											// disabled={!isValid}
											onClick={handleNext}
										>
											{t("COMMON.CONTINUE")}
										</Button>
									</>
								)}

								{activeTab === 4 && (
									<>
										<Button
											data-testid="SendVoteTransaction__button--back-to-wallet"
											variant="plain"
										>
											{t("COMMON.BACK_TO_WALLET")}
										</Button>
										<Button
											onClick={onCopy}
											data-testid="SendVoteTransaction__button--copy"
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
