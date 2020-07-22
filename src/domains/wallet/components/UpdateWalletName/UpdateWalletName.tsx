import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type UpdateWalletNameProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onSave: any;
};

const { NameWalletBanner } = images.wallet.components.updateWalletName;

export const UpdateWalletName = ({ ...props }: UpdateWalletNameProps) => {
	const methods = useForm({ mode: "onChange" });
	const { t } = useTranslation();

	return (
		<Modal
			title={t("WALLETS.MODAL_NAME_WALLET.TITLE")}
			description={t("WALLETS.MODAL_NAME_WALLET.DESCRIPTION")}
			image={<NameWalletBanner className="my-8" />}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<Form context={methods} onSubmit={props.onSave} className="mt-8">
				<FormField name="UpdateWalletName__input">
					<FormLabel>{t("WALLETS.MODAL_NAME_WALLET.FIELD_NAME")}</FormLabel>
					<Input
						ref={methods.register({ required: "Wallet name is required" })}
						data-testid="UpdateWalletName__input"
					/>
					<FormHelperText />
				</FormField>

				<div className="flex justify-end mt-8 space-x-3">
					<Button variant="plain" onClick={props.onCancel}>
						Cancel
					</Button>

					<Button type="submit" data-testid="UpdateWalletName__submit">
						Save
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
