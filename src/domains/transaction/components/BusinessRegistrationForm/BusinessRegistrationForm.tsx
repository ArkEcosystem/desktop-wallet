import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Label } from "app/components/Label";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "app/components/TransactionDetail";
import { InputFee } from "domains/transaction/components/InputFee";
import { LinkCollection } from "domains/transaction/components/LinkCollection";
import { LinkList } from "domains/transaction/components/LinkList";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { RegistrationForm } from "domains/transaction/pages/Registration/Registration.models";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const SecondStep = () => {
	const { t } = useTranslation();
	const { register } = useFormContext();

	return (
		<div data-testid="BusinessRegistrationForm__step--second">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_REGISTRATION.SECOND_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_REGISTRATION.SECOND_STEP.DESCRIPTION")}</div>

			<div>
				<div className="pb-8 mt-8">
					<FormField name="name" className="font-normal">
						<FormLabel>{t("TRANSACTION.NAME")}</FormLabel>
						<Input type="text" ref={register} />
					</FormField>

					<FormField name="description" className="mt-8 font-normal">
						<FormLabel>{t("TRANSACTION.DESCRIPTION")}</FormLabel>
						<TextArea ref={register} />
					</FormField>

					<FormField name="website" className="mt-8 font-normal">
						<FormLabel>{t("TRANSACTION.WEBSITE")}</FormLabel>
						<Input type="website" ref={register} />
					</FormField>
				</div>

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
						<InputFee
							defaultValue={(25 * 1e8).toFixed(0)}
							min={(1 * 1e8).toFixed(0)}
							max={(100 * 1e8).toFixed(0)}
							step={1}
						/>
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
		<div data-testid="BusinessRegistrationForm__step--third">
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
					<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.ZERO} />
				</div>
			</div>
		</div>
	);
};

const component = ({ activeTab }: { activeTab: number }) => (
	<Tabs activeId={activeTab}>
		<TabPanel tabId={2}>
			<SecondStep />
		</TabPanel>
		<TabPanel tabId={3}>
			<ThirdStep />
		</TabPanel>
	</Tabs>
);

const transactionDetails = ({ translations }: { translations: any }) => (
	<>
		<TransactionDetail
			label={translations("TRANSACTION.TRANSACTION_TYPE")}
			extra={
				<Circle className="border-black" size="lg">
					<Icon name="Business" width={20} height={20} />
				</Circle>
			}
		>
			Business Registration
		</TransactionDetail>
		<TransactionDetail label={translations("TRANSACTION.NAME")}>ROBank Eco</TransactionDetail>
		<TransactionDetail label={translations("TRANSACTION.DESCRIPTION")}>Not a trustworthy bank</TransactionDetail>
		<TransactionDetail label={translations("TRANSACTION.WEBSITE")}>
			<a href="http://robank.com" target="_blank" rel="noopener noreferrer" className="link">
				http://robank.com
			</a>
		</TransactionDetail>
	</>
);

component.displayName = "BusinessRegistrationForm";
transactionDetails.displayName = "BusinessRegistrationFormTransactionDetails";

export const BusinessRegistrationForm: RegistrationForm = {
	tabSteps: 2,
	component,
	transactionDetails,
	formFields: [],

	// eslint-disable-next-line @typescript-eslint/require-await
	signTransaction: async ({ handleNext }: any) => {
		handleNext();
	},
};
