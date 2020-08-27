import { ReadWriteWallet, WalletData } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Alert } from "app/components/Alert";
import { Amount } from "app/components/Amount";
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
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { InputFee } from "domains/transaction/components/InputFee";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect,useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type ResignRegistrationProps = {
	formDefaultData?: any;
	onDownload: any;
};

// TODO: Pull from sdk
type TransactionFee = {
	static: string;
	max: string;
	min: string;
	avg: string;
};

type StepProps = {
	wallet: ReadWriteWallet;
	delegate: WalletData | any;
	fee: TransactionFee;
};

const FirstStep = ({ wallet, delegate, fee }: StepProps) => {
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
				<TransactionDetail extra={<Avatar size="lg" address={wallet.address()} />} border={false}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} />
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>{delegate.username()}</TransactionDetail>

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="name" className="font-normal">
						<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
						<InputFee
							value={fee.static}
							defaultValue={fee.static}
							average={fee.avg}
							min={fee.min}
							max={fee.max}
							step={0.01}
						/>
					</FormField>
				</TransactionDetail>
			</div>
		</div>
	);
};

const SecondStep = ({ wallet, delegate, fee }: StepProps) => {
	const { t } = useTranslation();
	const coinName = wallet.manifest().get<string>("name");

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
								{coinName && <Icon name={upperFirst(coinName.toLowerCase())} width={20} height={20} />}
							</Circle>
						</div>
					}
				>
					<div className="flex-auto font-semibold truncate text-md text-theme-neutral-800 max-w-24">
						{coinName}
					</div>
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address={wallet.address()} />}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} />
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>{delegate.username()}</TransactionDetail>

				<div className="my-4">
					<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.make(fee.static)} />
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

export const FourthStep = ({ wallet, delegate, fee }: StepProps) => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful>
			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_TYPE")}
				extra={
					<Circle className="border-black" size="lg">
						<Icon name="Delegate" width={20} height={20} />
					</Circle>
				}
			>
				{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FOURTH_STEP.TITLE")}
			</TransactionDetail>
			<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>{delegate.username()}</TransactionDetail>
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
				<Amount ticker="ARK" value={BigNumber.make(fee.static)} />
			</TransactionDetail>
		</TransactionSuccessful>
	);
};

export const ResignRegistration = ({ formDefaultData, onDownload }: ResignRegistrationProps) => {
	const [activeTab, setActiveTab] = useState(1);
	const [delegate, setDelegate] = useState<WalletData | any>();
	const [fee, setFee] = useState<TransactionFee>();

	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });
	const { formState } = form;
	const { isValid } = formState;

	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const { t } = useTranslation();

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	useEffect(() => {
		const fetchDelegateInfo = async () => {
			const delegate = await activeWallet.client().delegate(activeWallet.address());
			setDelegate(delegate);
		};

		fetchDelegateInfo();
	}, [activeWallet]);

	useEffect(() => {
		const loadFees = async () => {
			try {
				const { delegateResignation } = await activeWallet.fee().all(7);
				setFee(delegateResignation);
			} catch (error) {
				// TODO: Set default or throw exception?
			}
		};

		loadFees();
	}, [setFee, activeProfile, activeWallet]);

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={(data: any) => onDownload(data)}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={6} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								{delegate && fee && <FirstStep wallet={activeWallet} delegate={delegate} fee={fee} />}
							</TabPanel>
							<TabPanel tabId={2}>
								{delegate && fee && <SecondStep wallet={activeWallet} delegate={delegate} fee={fee} />}
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
								{delegate && fee && <FourthStep wallet={activeWallet} delegate={delegate} fee={fee} />}
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
