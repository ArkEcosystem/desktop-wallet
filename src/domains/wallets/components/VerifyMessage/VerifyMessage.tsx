import React, { useState } from "react";
import { useForm } from "react-hook-form";
// UI Elements
import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel, FormHelperText } from "app/components/Form";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { Toggle } from "app/components/Toggle";

type Props = {
	onSubmit?: any;
	isOpen: boolean;
	handleClose?: any;
	publicKey?: string;
};

export const VerifyMessage = ({ onSubmit, publicKey, isOpen, handleClose }: Props) => {
	const form = useForm();
	const { register } = form;
	const [verifyAddress, setVerifyAddress] = useState(true);

	const renderFormContent = () => {
		if (verifyAddress)
			return (
				<div className="mt-10">
					<Alert variant="warning" size="small">
						<span className="p-5 text-sm font-semibold">{`Format(JSON): { "publicKey": "...", "signature": "...", "message": "..."}`}</span>
					</Alert>
					<FormField name="signet-message-content" className="mt-10">
						<FormLabel label="Signet message content" />
						<Input
							type="text"
							name="signet-message-content"
							defaultValue={""}
							ref={register({ required: true })}
						/>
						<FormHelperText />
					</FormField>
				</div>
			);

		return (
			<div data-testid="noverify-address__content">
				<FormField name="message-content" className="mt-10">
					<FormLabel label="Message" />
					<Input type="text" ref={register({ required: true })} />
					<FormHelperText />
				</FormField>
				<FormField name="public-key" className="mt-3">
					<FormLabel label="Public key" />
					<Input type="text" disabled defaultValue={publicKey} ref={register({ required: true })} />
					<FormHelperText />
				</FormField>
				<FormField name="signature" className="mt-3">
					<FormLabel label="Signature" />
					<Input type="text" ref={register({ required: true })} />
					<FormHelperText />
				</FormField>
			</div>
		);
	};
	return (
		<Modal
			isOpen={isOpen}
			title="Verify"
			description="To make sure that you are the owner of this wallet, you can pass the check. and this more text."
			onClick={handleClose}
		>
			<div className="mt-10">
				<div className="flex flex-col border-b border-dashed border-theme-neutral-light pb-5">
					<span className="text-base font-bold pb-2">Verify</span>
					<div className="flex flex-row justify-between">
						<span className="text-sm text-theme-neutral-light w-3/4">
							You can verify only text using a JSON public key
						</span>
						<div className="-mt-2 mr-1">
							<Toggle
								data-testid="verify-address__togle"
								className="-mt-3"
								checked={verifyAddress}
								onChange={(event) => setVerifyAddress(event.target.checked)}
							/>
						</div>
					</div>
				</div>

				<Form id="verify-message__form" context={form} onSubmit={onSubmit}>
					{renderFormContent()}
					<div className="flex items-center">
						<Button color="primary" variant="plain" size="large">
							Cancel
						</Button>
						<Button color="primary" variant="solid" size="large" className="ml-5">
							Verify
						</Button>
					</div>
				</Form>
			</div>
		</Modal>
	);
};

VerifyMessage.defaultProps = {
	isOpen: false,
};
