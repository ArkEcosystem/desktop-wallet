import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useActiveProfile } from "app/hooks/env";
import { InputFee } from "domains/transaction/components/InputFee";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { LinkCollection } from "domains/transaction/components/LinkCollection";
import { LinkList } from "domains/transaction/components/LinkList";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FirstStep = ({ form }: { form: any }) => {
	const { register } = form;
	const { t } = useTranslation();

	return (
		<div data-testid="SendEntityUpdate__first-step">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_UPDATE_REGISTRATION.FIRST_STEP.BUSINESS.TITLE")}</h1>
			<div className="text-theme-neutral-dark">
				{t("TRANSACTION.PAGE_UPDATE_REGISTRATION.FIRST_STEP.BUSINESS.DESCRIPTION")}
			</div>

			<div>
				<TransactionDetail border={false} className="pb-8">
					<FormField name="name" className="font-normal">
						<FormLabel>{t("TRANSACTION.NAME")}</FormLabel>
						<Input type="text" ref={register} defaultValue="ROBank Ecosystem" />
					</FormField>

					<FormField name="description" className="mt-8 font-normal">
						<FormLabel>{t("TRANSACTION.DESCRIPTION")}</FormLabel>
						<TextArea ref={register} defaultValue="Not a trustworthy bank" />
					</FormField>

					<FormField name="website" className="mt-8 font-normal">
						<FormLabel>{t("TRANSACTION.WEBSITE")}</FormLabel>
						<Input type="website" ref={register} defaultValue="http://robank.com" />
					</FormField>
				</TransactionDetail>

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
					<FormField name="name" className="font-normal">
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
