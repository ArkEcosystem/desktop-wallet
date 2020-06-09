import React from "react";
import { useForm } from "react-hook-form";
// UI Elements
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormLabel, FormHelperText } from "app/components/Form";
import { Input, InputPassword } from "app/components/Input";
import { Modal } from "app/components/Modal";

type Props = {
	onSubmit?: any;
	isOpen: boolean;
	handleClose?: any;
	signatoryAddress: string;
};

export const SignMessage = ({ onSubmit, signatoryAddress, isOpen, handleClose }: Props) => {
	const form = useForm();
	const { register } = form;

	return (
		<Modal
			isOpen={isOpen}
			title="Sign Message"
			description="Insert a message below to sign using your private key"
			onClick={handleClose}
		>
			<div className="mt-10">
				<Form id="sign-message__form" context={form} onSubmit={onSubmit}>
					<FormField name="signatory-address" className="relative">
						<FormLabel label="Signatory" />
						<Input type="text" disabled />
						<div className="absolute top-0 mt-10 ml-4">
							<Circle avatarId="test" size="small" noShadow />
							<span className="ml-3 font-semibold ">{signatoryAddress}</span>
						</div>
					</FormField>
					<FormField name="message">
						<FormLabel label="Message" />
						<Input type="text" ref={register({ required: true })} />
						<FormHelperText />
					</FormField>
					<FormField name="passphrase">
						<FormLabel label="Your Passphrase" />
						<InputPassword ref={register({ required: true })} />
						<FormHelperText />
					</FormField>
					<div className="flex items-center">
						<Button color="primary" variant="plain" size="large">
							Cancel
						</Button>
						<Button color="primary" variant="solid" size="large" className="ml-5">
							Sign
						</Button>
					</div>
				</Form>
			</div>
		</Modal>
	);
};

SignMessage.defaultProps = {
	isOpen: false,
};
