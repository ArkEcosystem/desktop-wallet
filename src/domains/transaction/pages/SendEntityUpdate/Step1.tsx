import { FormField, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "app/components/TransactionDetail";
import { InputFee } from "domains/transaction/components/InputFee";
import { LinkCollection } from "domains/transaction/components/LinkCollection";
import { EntityProvider } from "domains/transaction/entity/providers";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const entityProvider = new EntityProvider();

export const FirstStep = ({ form }: { form: any }) => {
	const { t } = useTranslation();

	const { register, setValue } = form;
	const { socialMediaLinks, repositoryLinks, imageLinks, videoLinks, fees, fee } = form.watch();

	useEffect(() => {
		["socialMediaLinks", "repositoryLinks", "imageLinks", "videoLinks", "fee", "fees"].map(register);
	}, []);

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
						types={entityProvider
							.sourceControl()
							.map(({ displayName: label, id: value, validate }) => ({ label, value, validate }))}
						typeName="repository"
						data={repositoryLinks}
					/>
				</TransactionDetail>

				<TransactionDetail className="pb-8">
					<LinkCollection
						title={t("TRANSACTION.SOCIAL_MEDIA.TITLE")}
						description={t("TRANSACTION.SOCIAL_MEDIA.DESCRIPTION")}
						types={entityProvider
							.socialMedia()
							.map(({ displayName: label, id: value, validate }) => ({ label, value, validate }))}
						typeName="media"
						data={socialMediaLinks}
					/>
				</TransactionDetail>

				<TransactionDetail className="pb-8">
					<LinkCollection
						title={t("TRANSACTION.PHOTO_VIDEO.TITLE")}
						description={t("TRANSACTION.PHOTO_VIDEO.DESCRIPTION")}
						types={entityProvider
							.media()
							.map(({ displayName: label, id: value, validate }) => ({ label, value, validate }))}
						typeName="files"
						selectionTypes={["flickr"]}
						selectionTypeTitle="Avatar"
						data={[...videoLinks, ...imageLinks]}
					/>
				</TransactionDetail>

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="fee" className="font-normal">
						<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
						<InputFee
							min={fees.min}
							avg={fees.avg}
							max={fees.max}
							defaultValue={fee || 0}
							value={fee || 0}
							step={0.01}
							onChange={(value: any) => setValue("fee", value, true)}
						/>
					</FormField>
				</TransactionDetail>
			</div>
		</div>
	);
};
