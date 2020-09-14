import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "app/components/TransactionDetail";
import { InputFee } from "domains/transaction/components/InputFee";
import { LinkCollection } from "domains/transaction/components/LinkCollection";
import { EntityProvider } from "domains/transaction/entity/providers";
import React, { ChangeEvent, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const entityProvider = new EntityProvider();

export const FirstStep = () => {
	const { t } = useTranslation();

	const form = useFormContext();
	const { setValue, getValues } = form;

	const { fee, fees } = form.watch();

	const handleInput = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setValue(event.target.name, event.target.value, true);
		},
		[setValue],
	);

	return (
		<div data-testid="SendEntityUpdate__first-step">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_UPDATE_REGISTRATION.FIRST_STEP.BUSINESS.TITLE")}</h1>
			<div className="text-theme-neutral-dark">
				{t("TRANSACTION.PAGE_UPDATE_REGISTRATION.FIRST_STEP.BUSINESS.DESCRIPTION")}
			</div>

			<div>
				<TransactionDetail border={false} className="pb-8">
					<FormField name="ipfsData.meta.displayName" className="font-normal">
						<FormLabel>{t("TRANSACTION.NAME")}</FormLabel>
						<Input
							type="text"
							data-testid="SendEntityUpdate__name"
							defaultValue={getValues("ipfsData.meta.displayName")}
							onChange={handleInput}
						/>
						<FormHelperText />
					</FormField>

					<FormField name="ipfsData.meta.description" className="mt-8 font-normal">
						<FormLabel>{t("TRANSACTION.DESCRIPTION")}</FormLabel>
						<TextArea
							data-testid="SendEntityUpdate__description"
							defaultValue={getValues("ipfsData.meta.description")}
							onChange={handleInput}
						/>
						<FormHelperText />
					</FormField>

					<FormField name="ipfsData.meta.website" className="mt-8 font-normal">
						<FormLabel>{t("TRANSACTION.WEBSITE")}</FormLabel>
						<Input
							type="website"
							data-testid="SendEntityUpdate__website"
							defaultValue={getValues("ipfsData.meta.website")}
							onChange={handleInput}
						/>
						<FormHelperText />
					</FormField>
				</TransactionDetail>

				<TransactionDetail className="pb-8" data-testid="SendEntityUpdate__source">
					<LinkCollection
						title={t("TRANSACTION.REPOSITORIES.TITLE")}
						description={t("TRANSACTION.REPOSITORIES.DESCRIPTION")}
						types={entityProvider
							.sourceControl()
							.map(({ displayName: label, id: value, validate }) => ({ label, value, validate }))}
						typeName="repository"
						data={getValues("ipfsData.sourceControl") || []}
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
						data={getValues("ipfsData.socialMedia") || []}
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
						data={[...(getValues("images") || []), ...(getValues("videos") || [])]}
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
