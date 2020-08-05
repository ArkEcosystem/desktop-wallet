import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import React, { useEffect, useMemo } from "react";
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
	const methods = useForm({ mode: "onChange", defaultValues: { name } });
	const formValues = methods.watch();

	const { t } = useTranslation();
	const nameMaxLength = 42;

	const isNameValid = useMemo(() => !!formValues.name?.trim() && !methods.errors?.name, [formValues, methods.errors]);

	const handleSubmit = ({ name }: any) => {
		const formattedName = name.substring(0, nameMaxLength);
		onSave?.({ name: formattedName });
	};

	useEffect(() => {
		if (isOpen) {
			methods.setValue("name", name as string);
		}
	}, [name, isOpen]);

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
					<FormLabel>{t("WALLETS.MODAL_NAME_WALLET.FIELD_NAME")}</FormLabel>
					<Input
						data-testid="UpdateWalletName__input"
						ref={methods.register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("COMMON.NAME"),
							}).toString(),
							maxLength: {
								value: nameMaxLength,
								message: t("WALLETS.MODAL_NAME_WALLET.MAXLENGTH_ERROR", {
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

					<Button type="submit" data-testid="UpdateWalletName__submit" disabled={!isNameValid}>
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
