import { NetworkData } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Page, Section } from "app/components/Layout";
import { Select } from "app/components/SelectDropdown";
import { useSelectionState } from "app/components/SelectionBar";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useActiveProfile } from "app/hooks/env";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { availableNetworksMock } from "domains/network/data";
import { SelectAddress } from "domains/profile/components/SelectAddress";
import { InputFee } from "domains/transaction/components/InputFee";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { LinkCollection } from "domains/transaction/components/LinkCollection";
import { LinkList } from "domains/transaction/components/LinkList";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

type RegistrationProps = {
	formDefaultData?: any;
	onDownload?: any;
	networks?: NetworkData[];
	registrationTypes?: any;
	wallets: any[];
};

type RegistrationType = { label: string; value: string };

const FormWrapper = styled.div`
	.select-transparent {
		> div:first-child {
			width: 100%;
		}

		select {
			&:not([disabled]) {
				background-color: transparent;
				color: transparent;
			}
			option {
				color: var(--theme-color-neutral-900);
			}
		}
	}
`;

const RegistrationTypeDropdown = ({ className, register, registrationTypes }: any) => {
	const { t } = useTranslation();

	return (
		<FormField data-testid="Registration__type" name="registrationType" className={`relative h-20 ${className}`}>
			<div className="mb-2">
				<FormLabel label={t("TRANSACTION.REGISTRATION_TYPE")} />
			</div>
			<div>
				<Select ref={register} data-testid="Registration__type-select" options={registrationTypes} />
			</div>
		</FormField>
	);
};

const getRegistrationByName = (registrationTypes: any[], registrationType: string) => {
	return registrationTypes.find((type: any) => type.value === registrationType);
};

const FirstStep = ({
	form,
	networks,
	registrationTypes,
	wallets,
}: {
	form: any;
	networks: NetworkData[];
	registrationTypes: RegistrationType[];
	wallets: any[];
}) => {
	const { register } = form;
	const { address, registrationType } = form.watch();

	const { t } = useTranslation();

	return (
		<div data-testid="Registration__first-step">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_REGISTRATION.FIRST_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_REGISTRATION.FIRST_STEP.DESCRIPTION")}</div>

			<FormWrapper className="mt-8">
				<FormField name="network">
					<FormLabel label={t("TRANSACTION.NETWORK")} />
					<SelectNetwork id="Registration__network" networks={networks} />
				</FormField>

				<FormField name="address" className="relative mt-8">
					<div className="mb-2">
						<FormLabel label={t("TRANSACTION.ADDRESS")} />
					</div>

					<div data-testid="Registration__address-field">
						<SelectAddress
							contactSearchTitle={t("TRANSACTION.CONTACT_SEARCH.TITLE")}
							contactSearchDescription={t("TRANSACTION.CONTACT_SEARCH.DESCRIPTION")}
							address={address}
							ref={register}
							wallets={wallets}
						/>
					</div>
				</FormField>

				<RegistrationTypeDropdown
					selectedType={getRegistrationByName(registrationTypes, registrationType)}
					registrationTypes={registrationTypes}
					className="mt-8"
					register={register}
				/>
			</FormWrapper>
		</div>
	);
};

const SecondStep = ({ form }: { form: any }) => {
	const { register } = form;
	const selectionBarState = useSelectionState(1);

	const { t } = useTranslation();

	return (
		<div data-testid="Registration__second-step">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_REGISTRATION.SECOND_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_REGISTRATION.SECOND_STEP.DESCRIPTION")}</div>

			<div>
				<FormWrapper className="pb-8 mt-8">
					<FormField name="name" className="font-normal">
						<FormLabel required>{t("TRANSACTION.NAME")}</FormLabel>
						<Input type="text" ref={register} />
					</FormField>

					<FormField name="description" className="mt-8 font-normal">
						<FormLabel required>{t("TRANSACTION.DESCRIPTION")}</FormLabel>
						<TextArea ref={register} />
					</FormField>

					<FormField name="website" className="mt-8 font-normal">
						<FormLabel>{t("TRANSACTION.WEBSITE")}</FormLabel>
						<Input type="website" ref={register} />
					</FormField>
				</FormWrapper>

				<TransactionDetail className="pb-8">
					<LinkCollection
						title={t("TRANSACTION.REPOSITORIES.TITLE")}
						description={t("TRANSACTION.REPOSITORIES.DESCRIPTION")}
						types={[
							{ label: "BitBucket", value: "bitbucket" },
							{ label: "GitHub", value: "github" },
							{ label: "GitLab", value: "gitlab" },
						]}
						typeName="repository"
					/>
				</TransactionDetail>

				<TransactionDetail className="pb-8">
					<LinkCollection
						title={t("TRANSACTION.SOCIAL_MEDIA.TITLE")}
						description={t("TRANSACTION.SOCIAL_MEDIA.DESCRIPTION")}
						types={[
							{ label: "Facebook", value: "facebook" },
							{ label: "Twitter", value: "twitter" },
							{ label: "LinkedIn", value: "linkedin" },
						]}
						typeName="media"
					/>
				</TransactionDetail>

				<TransactionDetail className="pb-8">
					<LinkCollection
						title={t("TRANSACTION.PHOTO_VIDEO.TITLE")}
						description={t("TRANSACTION.PHOTO_VIDEO.DESCRIPTION")}
						types={[
							{ label: "YouTube", value: "youtube" },
							{ label: "Vimeo", value: "vimeo" },
							{ label: "Flickr", value: "flickr" },
						]}
						typeName="files"
						selectionTypes={["flickr"]}
						selectionTypeTitle="Avatar"
					/>
				</TransactionDetail>

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="fee">
						<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
						<InputFee selectionBarState={selectionBarState} defaultValue={25} min={1} max={100} step={1} />
					</FormField>
				</TransactionDetail>
			</div>
		</div>
	);
};

const ThirdStep = () => {
	const { t } = useTranslation();

	const links = [
		{
			link: "http://github.com/robank",
			type: "github",
		},
		{
			link: "http://gitlab.com/robank",
			type: "gitlab",
		},
		{
			link: "http://bitbucket.com/robank",
			type: "bitbucket",
		},
		{
			link: "http://npmjs.com/robank",
			type: "npm",
		},
	];

	return (
		<div data-testid="Registration__third-step">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_REGISTRATION.THIRD_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_REGISTRATION.THIRD_STEP.DESCRIPTION")}</div>
			<div className="mt-4">
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

				<TransactionDetail
					extra={<Avatar size="lg" address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}
					className="pt-4"
				>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.TYPE")}
					extra={
						<div>
							<Circle className="border-black bg-theme-background" size="lg">
								<Icon name="Business" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					Business Registration
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.NAME")}>ROBank Eco</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.DESCRIPTION")}>Not a trustworthy bank</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.WEBSITE")}>
					<a href="http://robank.com" target="_blank" rel="noopener noreferrer" className="link">
						http://robank.com
					</a>
				</TransactionDetail>

				<TransactionDetail className="mb-2">
					<LinkList
						title="Repository"
						description="Show your projects through the repository"
						links={links}
					/>
				</TransactionDetail>

				<div>
					<TotalAmountBox transactionAmount="0.00" transactionFee="0.09660435" />
				</div>
			</div>
		</div>
	);
};

const FourthStep = ({ form, passwordType }: { form: any; passwordType: "mnemonic" | "password" | "ledger" }) => {
	const { register } = form;

	const { t } = useTranslation();

	return (
		<div data-testid="Registration__fourth-step">
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

export const FifthStep = () => {
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
				Business Registration
			</TransactionDetail>
			<TransactionDetail label={t("TRANSACTION.NAME")}>ROBank Eco</TransactionDetail>
			<TransactionDetail label={t("TRANSACTION.DESCRIPTION")}>Not a trustworthy bank</TransactionDetail>
			<TransactionDetail label={t("TRANSACTION.WEBSITE")}>
				<a href="http://robank.com" target="_blank" rel="noopener noreferrer" className="link">
					http://robank.com
				</a>
			</TransactionDetail>
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
				1.09660435 ARK
			</TransactionDetail>
		</TransactionSuccessful>
	);
};

export const Registration = ({
	formDefaultData,
	onDownload,
	networks,
	wallets,
	registrationTypes,
}: RegistrationProps) => {
	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });
	const activeProfile = useActiveProfile();
	const [activeTab, setActiveTab] = React.useState(1);
	const { formState } = form;
	const { isValid } = formState;

	const { t } = useTranslation();

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const crumbs = [
		{
			route: `/wallets/${activeProfile?.id()}/dashboard`,
			label: "Go back to Portfolio",
		},
	];

	return (
		<Page crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={(data: any) => onDownload(data)}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={7} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep
									wallets={wallets}
									form={form}
									networks={networks!}
									registrationTypes={registrationTypes}
								/>
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep form={form} />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep />
							</TabPanel>
							<TabPanel tabId={4}>
								<FourthStep form={form} passwordType="mnemonic" />
							</TabPanel>
							<TabPanel tabId={5}>
								<FourthStep form={form} passwordType="password" />
							</TabPanel>
							<TabPanel tabId={6}>
								<FourthStep form={form} passwordType="ledger" />
							</TabPanel>
							<TabPanel tabId={7}>
								<FifthStep />
							</TabPanel>

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
										disabled={!isValid}
										onClick={handleNext}
									>
										{t("COMMON.CONTINUE")}
									</Button>
								)}

								{activeTab >= 4 && activeTab < 7 && (
									<Button
										data-testid="Registration__send-button"
										disabled={!isValid}
										onClick={handleNext}
										className="space-x-2"
									>
										<Icon name="Send" width={20} height={20} />
										<span>{t("COMMON.SEND")}</span>
									</Button>
								)}

								{activeTab === 7 && (
									<div className="flex justify-end space-x-3">
										<Button data-testid="Registration__wallet-button" variant="plain">
											{t("COMMON.BACK_TO_WALLET")}
										</Button>

										<Button
											type="submit"
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

Registration.defaultProps = {
	networks: availableNetworksMock,
	registrationTypes: [
		{
			value: "business",
			label: "Business",
		},
	],
	formDefaultData: {
		network: null,
		address: null,
	},
	wallets: [],
};
