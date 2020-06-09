import React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useForm } from "react-hook-form";
// UI Elements
import { Modal } from "./Modal";
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel, FormHelperText } from "app/components/Form";
import { Input } from "app/components/Input";

type ModalProps = {
	isOpen: boolean;
	onClose?: React.MouseEventHandler;
	onCancel?: React.MouseEventHandler;
	onSave: React.MouseEventHandler;
} & WrappedComponentProps;

export const ModalNameWallet = injectIntl(({ intl: { formatMessage }, ...props }: ModalProps) => {
	const methods = useForm({ mode: "onChange" });

	return (
		<Modal
			title={formatMessage({ id: "WALLET.MODAL_NAME_WALLET.TITLE" })}
			description={formatMessage({ id: "WALLET.MODAL_NAME_WALLET.DESCRIPTION" })}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<Form context={methods} onSubmit={(e) => props.onSave(e)}>
				<FormField name="name">
					<FormLabel>{formatMessage({ id: "COMMON_NEXT" })}</FormLabel>
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

ModalNameWallet.defaultProps = {
	isOpen: false,
};

ModalNameWallet.displayName = "ModalNameWallet";
