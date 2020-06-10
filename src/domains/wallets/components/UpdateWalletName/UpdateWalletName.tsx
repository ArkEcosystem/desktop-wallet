import React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useForm } from "react-hook-form";
// UI Elements
import { Modal } from "app/components/Modal";
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel, FormHelperText } from "app/components/Form";
import { Input } from "app/components/Input";

type UpdateWalletNameProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onSave: any;
} & WrappedComponentProps;

export const UpdateWalletName = injectIntl(({ intl: { formatMessage }, ...props }: UpdateWalletNameProps) => {
	const methods = useForm({ mode: "onChange" });

	return (
		<Modal
			title={formatMessage({ id: "WALLETS_MODAL_NAME_WALLET_TITLE" })}
			description={formatMessage({ id: "WALLETS_MODAL_NAME_WALLET_DESCRIPTION" })}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<Form context={methods} onSubmit={props.onSave}>
				<FormField name="name">
					<FormLabel>{formatMessage({ id: "WALLETS_MODAL_NAME_WALLET_FIELD_NAME" })}</FormLabel>
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
});

UpdateWalletName.defaultProps = {
	isOpen: false,
};

UpdateWalletName.displayName = "UpdateWalletName";
