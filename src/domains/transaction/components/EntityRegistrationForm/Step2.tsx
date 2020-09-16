import { Contracts } from "@arkecosystem/platform-sdk";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "app/components/TransactionDetail";
import { InputFee } from "domains/transaction/components/InputFee";
import { LinkCollection } from "domains/transaction/components/LinkCollection";
import { EntityLink } from "domains/transaction/components/LinkCollection/LinkCollection.models";
import { EntityProvider } from "domains/transaction/entity/providers";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

const entityProvider = new EntityProvider();

export const FormStep = ({ fees }: { fees: Contracts.TransactionFee }) => {
	const { t } = useTranslation();
	const { register, setValue, getValues } = useFormContext();
	const { fee } = getValues();
	const [selectedAvatar, setSelectedAvatar] = useState<EntityLink | undefined>();

	useEffect(() => {
		register("entityName", { required: true, minLength: 3, maxLength: 40, pattern: /^[a-zA-Z0-9_-]+$/ });
		register("ipfsData.meta.displayName", { required: true, minLength: 3, maxLength: 128 });
		register("ipfsData.meta.website", {
			validate: {
				valid: (value) => {
					if (!yup.string().url().isValidSync(value)) {
						return t<string>("TRANSACTION.INVALID_URL");
					}
					return true;
				},
			},
		});
		register("ipfsData.meta.description", { minLength: 3, maxLength: 512 });
		register("ipfsData.sourceControl");
		register("ipfsData.socialMedia");
		register("ipfsData.images");
		register("ipfsData.videos");
	}, [register, t]);

	const handleInput = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setValue(event.target.name, event.target.value, { shouldValidate: true, shouldDirty: true });
		},
		[setValue],
	);

	const handleSourceControl = useCallback(
		(links: EntityLink[]) => {
			setValue("ipfsData.sourceControl", links, { shouldValidate: true, shouldDirty: true });
		},
		[setValue],
	);

	const handleSocialMedia = useCallback(
		(links: EntityLink[]) => {
			setValue("ipfsData.socialMedia", links, { shouldValidate: true, shouldDirty: true });
		},
		[setValue],
	);

	const handleMedia = useCallback(
		(links: EntityLink[]) => {
			// Image and video are separates tags in ipfsData
			// But in design they are handled together
			// Also, the link `type` should be an image | video | logo instead of provider id

			const imagesProviderIds = entityProvider.images().map((item) => item.id);

			const images = links.filter((link) => imagesProviderIds.includes(link.type));
			const videos = links.filter((link) => !imagesProviderIds.includes(link.type));

			if (images.length) {
				setValue(
					"ipfsData.images",
					images.map((item) => ({
						...item,
						type: selectedAvatar?.value === item.value ? "logo" : "image",
					})),
				);
			}

			if (videos.length) {
				setValue(
					"ipfsData.videos",
					videos.map((item) => ({ ...item, type: "video" })),
				);
			}
		},
		[setValue, selectedAvatar],
	);

	const handleAvatar = useCallback(
		(link: EntityLink) => {
			const images = getValues("ipfsData.images");
			const newImages = (images || []).map((item: EntityLink) => ({
				...item,
				type: item.value === link.value ? "logo" : "image",
			}));
			setValue("ipfsData.images", newImages);
			setSelectedAvatar(link);
		},
		[getValues, setValue, setSelectedAvatar],
	);

	return (
		<div data-testid="BusinessRegistrationForm__step--second">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_REGISTRATION.SECOND_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_REGISTRATION.SECOND_STEP.DESCRIPTION")}</div>

			<div>
				<div className="pb-8 mt-8">
					<FormField name="entityName" className="font-normal">
						<FormLabel>{t("TRANSACTION.NAME")}</FormLabel>
						<Input data-testid="BusinessRegistrationForm__name" type="text" onChange={handleInput} />
						<FormHelperText errorMessage={t("TRANSACTION.ENTITY.INVALID_NAME")} />
					</FormField>

					<FormField name="ipfsData.meta.displayName" className="mt-8 font-normal">
						<FormLabel>{t("TRANSACTION.ENTITY.DISPLAY_NAME")}</FormLabel>
						<Input
							data-testid="BusinessRegistrationForm__display-name"
							type="text"
							onChange={handleInput}
						/>
						<FormHelperText />
					</FormField>

					<FormField name="ipfsData.meta.description" className="mt-8 font-normal">
						<FormLabel>{t("TRANSACTION.DESCRIPTION")}</FormLabel>
						<TextArea data-testid="BusinessRegistrationForm__description" onChange={handleInput} />
						<FormHelperText errorMessage={t("TRANSACTION.ENTITY.INVALID_DESCRIPTION")} />
					</FormField>

					<FormField name="ipfsData.meta.website" className="mt-8 font-normal">
						<FormLabel>{t("TRANSACTION.WEBSITE")}</FormLabel>
						<Input data-testid="BusinessRegistrationForm__website" type="text" onChange={handleInput} />
						<FormHelperText />
					</FormField>
				</div>

				<TransactionDetail className="pb-8">
					<LinkCollection
						title={t("TRANSACTION.REPOSITORIES.TITLE")}
						description={t("TRANSACTION.REPOSITORIES.DESCRIPTION")}
						types={entityProvider
							.sourceControl()
							.map(({ displayName: label, id: value, validate }) => ({ label, value, validate }))}
						typeName="repository"
						onChange={handleSourceControl}
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
						onChange={handleSocialMedia}
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
						selectionTypes={entityProvider.images().map((item) => item.id)}
						selectionTypeTitle="Avatar"
						onChange={handleMedia}
						onChoose={handleAvatar}
					/>
				</TransactionDetail>

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="fee">
						<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
						<InputFee
							min={fees.min}
							avg={fees.avg}
							max={fees.max}
							defaultValue={fee || 0}
							value={fee || 0}
							step={0.01}
							onChange={(value: any) =>
								setValue("fee", value, { shouldValidate: true, shouldDirty: true })
							}
						/>
					</FormField>
				</TransactionDetail>
			</div>
		</div>
	);
};
