import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input } from "app/components/Input";
import { TextArea } from "app/components/TextArea";
import { useValidation } from "app/hooks";
import { InputFee } from "domains/transaction/components/InputFee";
import { LinkCollection } from "domains/transaction/components/LinkCollection";
import { EntityLink } from "domains/transaction/components/LinkCollection/LinkCollection.models";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import { EntityProvider } from "domains/transaction/entity/providers";
import React, { ChangeEvent, useCallback, useEffect,useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const entityProvider = new EntityProvider();

type FormStepProps = {
	title?: string;
	description?: string;
	showEntityNameField?: boolean;
};

export const FormStep = ({ title, description, showEntityNameField = true }: FormStepProps) => {
	const [selectedAvatar, setSelectedAvatar] = useState<EntityLink | undefined>();

	const { t } = useTranslation();

	const form = useFormContext();
	const { setValue, getValues, register, unregister } = form;
	const { fee, fees } = form.watch();
	const { common } = useValidation();

	useEffect(() => {
		register("fee", common.fee(fees));
		return () => unregister("fee");
	}, [register, common]);

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
			const newImages = images.map((item: EntityLink) => ({
				...item,
				type: item.value === link?.value ? "logo" : "image",
			}));
			setValue("ipfsData.images", newImages);
			setSelectedAvatar(link);
		},
		[getValues, setValue, setSelectedAvatar],
	);

	return (
		<section data-testid="EntityRegistrationForm" className="space-y-8">
			<Header
				title={title || t("TRANSACTION.PAGE_REGISTRATION.SECOND_STEP.TITLE")}
				subtitle={description || t("TRANSACTION.PAGE_REGISTRATION.SECOND_STEP.DESCRIPTION")}
			/>

			{showEntityNameField && (
				<FormField name="entityName">
					<FormLabel>{t("TRANSACTION.NAME")}</FormLabel>
					<Input
						data-testid="EntityRegistrationForm__entity-name"
						type="text"
						onChange={handleInput}
						defaultValue={getValues("entityName")}
					/>
					<FormHelperText />
				</FormField>
			)}

			<FormField name="ipfsData.meta.displayName">
				<FormLabel>{t("TRANSACTION.ENTITY.DISPLAY_NAME")}</FormLabel>
				<Input
					data-testid="EntityRegistrationForm__display-name"
					type="text"
					onChange={handleInput}
					defaultValue={getValues("ipfsData.meta.displayName")}
				/>
				<FormHelperText />
			</FormField>

			<FormField name="ipfsData.meta.description">
				<FormLabel>{t("TRANSACTION.DESCRIPTION")}</FormLabel>
				<TextArea
					data-testid="EntityRegistrationForm__description"
					onChange={handleInput}
					defaultValue={getValues("ipfsData.meta.description")}
				/>
				<FormHelperText />
			</FormField>

			<FormField name="ipfsData.meta.website">
				<FormLabel>{t("TRANSACTION.WEBSITE")}</FormLabel>
				<Input
					data-testid="EntityRegistrationForm__website"
					type="text"
					onChange={handleInput}
					defaultValue={getValues("ipfsData.meta.website")}
				/>
				<FormHelperText />
			</FormField>

			<div>
				<TransactionDetail>
					<LinkCollection
						title={t("TRANSACTION.REPOSITORIES.TITLE")}
						description={t("TRANSACTION.REPOSITORIES.DESCRIPTION")}
						types={entityProvider
							.sourceControl()
							.map(({ displayName: label, id: value, validate }) => ({ label, value, validate }))}
						typeName="repository"
						onChange={handleSourceControl}
						data={getValues("ipfsData.sourceControl")}
					/>
				</TransactionDetail>

				<TransactionDetail>
					<LinkCollection
						title={t("TRANSACTION.SOCIAL_MEDIA.TITLE")}
						description={t("TRANSACTION.SOCIAL_MEDIA.DESCRIPTION")}
						types={entityProvider
							.socialMedia()
							.map(({ displayName: label, id: value, validate }) => ({ label, value, validate }))}
						typeName="media"
						onChange={handleSocialMedia}
						data={getValues("ipfsData.socialMedia")}
					/>
				</TransactionDetail>

				<TransactionDetail borderPosition="both">
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
						data={[...(getValues("images") || []), ...(getValues("videos") || [])]}
					/>
				</TransactionDetail>
			</div>

			<div>
				<FormField name="fee">
					<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
					<InputFee
						min={fees.min}
						avg={fees.avg}
						max={fees.max}
						defaultValue={fee || 0}
						value={fee || 0}
						step={0.01}
						onChange={(currency) =>
							setValue("fee", currency.value, { shouldValidate: true, shouldDirty: true })
						}
					/>
					<FormHelperText />
				</FormField>
			</div>
		</section>
	);
};
