import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type UpdateWalletNameProps = {
	name?: string;
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onSave: any;
};

const { NameWalletBanner } = images.wallet.components.updateWalletName;

export const UpdateWalletName = ({ isOpen, onClose, onCancel, onSave, name }: UpdateWalletNameProps) => {
	const methods = useForm<Record<string, any>>({ mode: "onChange", defaultValues: { name } });
	const { formState, register, setValue } = methods;

	const { t } = useTranslation();
	const nameMaxLength = 42;

	useEffect(() => {
		if (isOpen) setValue("name", name as string);
	}, [name, isOpen, setValue]);

	const handleSubmit = ({ name }: any) => {
		onSave(name.trim().substring(0, nameMaxLength));
	};

	return (
		<Modal
			title={t("WALLETS.MODAL_NAME_WALLET.TITLE")}
			description={t("WALLETS.MODAL_NAME_WALLET.DESCRIPTION")}
			image={<NameWalletBanner className="my-8" />}
			isOpen={isOpen}
			onClose={onClose}
		>
			<Form context={methods} onSubmit={handleSubmit} className="mt-8">
				<FormField name="name">
					<FormLabel required={false}>{t("COMMON.NAME")}</FormLabel>
					<Input
						data-testid="UpdateWalletName__input"
						ref={register({
							validate: {
								whitespaceOnly: (name) => {
									if (name.length) {
										return (
											!!name.trim().length ||
											t("COMMON.VALIDATION.FIELD_INVALID", {
												field: t("COMMON.NAME"),
											}).toString()
										);
									}

									return true;
								},
							},
							maxLength: {
								value: nameMaxLength,
								message: t("COMMON.VALIDATION.MAX_LENGTH", {
									field: t("COMMON.NAME"),
									maxLength: nameMaxLength,
								}),
							},
						})}
					/>
					<FormHelperText />
				</FormField>

				<div className="flex justify-end mt-8 space-x-3">
					<Button variant="plain" onClick={onCancel}>
						{t("COMMON.CANCEL")}
					</Button>

					<Button type="submit" data-testid="UpdateWalletName__submit" disabled={!formState.isValid}>
						{t("COMMON.SAVE")}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

UpdateWalletName.defaultProps = {
	isOpen: false,
};

UpdateWalletName.displayName = "UpdateWalletName";
