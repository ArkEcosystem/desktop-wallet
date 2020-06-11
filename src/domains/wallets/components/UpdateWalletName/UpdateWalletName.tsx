import React from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
// UI Elements
import { Modal } from "app/components/Modal";
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel, FormHelperText } from "app/components/Form";
import { Input } from "app/components/Input";

import { images } from "app/assets/images";

type UpdateWalletNameProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onSave: any;
};

const NameWalletBanner = images.wallet.components.updateWalletName.NameWalletBanner;

export const UpdateWalletName = ({ ...props }: UpdateWalletNameProps) => {
	const methods = useForm({ mode: "onChange" });
	const { t } = useTranslation();

	return (
		<Modal
			title={t("WALLETS.MODAL_NAME_WALLET.TITLE")}
			description={t("WALLETS.MODAL_NAME_WALLET.DESCRIPTION")}
			image={<NameWalletBanner className="mb-8" />}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<Form context={methods} onSubmit={props.onSave}>
				<FormField name="name">
					<FormLabel>{t("WALLETS.MODAL_NAME_WALLET.FIELD_NAME")}</FormLabel>
					<Input ref={methods.register({ required: "Field required" })} />
					<FormHelperText />
				</FormField>

				<div className="mt-4">
					<Button color="primary" variant="plain" onClick={props.onCancel} className="mr-2">
						Cancel
					</Button>

					<Button type="submit" color="primary" variant="solid">
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
