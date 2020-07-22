// UI Elements
import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { Toggle } from "app/components/Toggle";
import { useEnvironment } from "app/contexts";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
	onSubmit?: any;
	onCancel?: any;
	isOpen: boolean;
	handleClose?: any;
	signatory?: string;
	profileId: string;
	walletPublicKey: string;
};

export const VerifyMessage = ({
	profileId,
	walletPublicKey,
	onSubmit,
	onCancel,
	signatory,
	isOpen,
	handleClose,
}: Props) => {
	const env = useEnvironment();
	const form = useForm();
	const { register } = form;
	const [verifyAddress, setVerifyAddress] = useState(true);

	const handleSubmit = async () => {
		let isVerified = false;
		const formValues = form.getValues();
		const profile = env?.profiles().findById(profileId);
		const wallet = profile?.wallets().findByPublicKey(walletPublicKey);

		try {
			const signedMessage = JSON.parse(formValues["signet-message-content"]);
			isVerified = (await wallet?.message().verify(signedMessage)) as boolean;
			onSubmit?.(isVerified);
		} catch {
			onSubmit?.(false);
		}
	};

	const renderFormContent = () => {
		if (verifyAddress)
			return (
				<div className="mt-8">
					<Alert variant="warning">
						<span className="text-sm font-medium">{`Format(JSON): { "signatory": "...", "signature": "...", "message": "..."}`}</span>
					</Alert>

					<div className="mt-8">
						<FormField name="signet-message-content">
							<FormLabel label="Signet message content" />
							<Input
								data-testid="VerifyMessage_message-content"
								type="text"
								name="signet-message-content"
								defaultValue={""}
								ref={register({ required: true })}
							/>
							<FormHelperText />
						</FormField>
					</div>
				</div>
			);

		return (
			<div data-testid="noverify-address__content">
				<FormField name="message" className="mt-8">
					<FormLabel label="Message" />
					<Input type="text" ref={register({ required: true })} data-testid="VerifyMessage__message-input" />
					<FormHelperText />
				</FormField>
				<FormField name="signatory" className="mt-8">
					<FormLabel label="Signatory" />
					<Input
						data-testid="VerifyMessage__signatory-input"
						type="text"
						disabled
						defaultValue={signatory}
						ref={register({ required: true })}
					/>
					<FormHelperText />
				</FormField>
				<FormField name="signature" className="mt-8">
					<FormLabel label="Signature" />
					<Input
						type="text"
						ref={register({ required: true })}
						data-testid="VerifyMessage__signature-input"
					/>
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
			onClose={handleClose}
		>
			<div className="mt-8">
				<div className="flex flex-col pb-6 border-b border-dashed border-theme-neutral-light">
					<span className="text-lg font-semibold">Verify</span>
					<div className="flex flex-row justify-between">
						<span className="pt-2 text-sm text-theme-neutral">
							You can verify only text using a JSON public key
						</span>
						<div className="mr-1 -mt-7">
							<Toggle
								data-testid="verify-address__toggle"
								checked={verifyAddress}
								onChange={(event) => setVerifyAddress(event.target.checked)}
							/>
						</div>
					</div>
				</div>

				<Form id="verify-message__form" context={form} onSubmit={handleSubmit}>
					{renderFormContent()}
					<div className="flex justify-end space-x-3">
						<Button variant="plain" data-testid="VerifyMessage__cancel" onClick={onCancel}>
							Cancel
						</Button>
						<Button type="submit" data-testid="VerifyMessage__submit">
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
