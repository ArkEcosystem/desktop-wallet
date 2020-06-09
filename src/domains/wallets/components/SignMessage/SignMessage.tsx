import React from "react";
import { useForm } from "react-hook-form";
// UI Elements
import { Circle } from "app/components/Circle";
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel, FormHelperText } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input, InputPassword } from "app/components/Input";

type Props = {
	onSubmit?: any;
	signatory: string;
};

export const SignMessage = ({ onSubmit, signatoryAddress }: Props) => {
	const form = useForm();
	const { register, errors } = form;

	return (
		<div>
			<Header title="Sign Message" subtitle="Insert a message below to sign using your private key" />
			<div className="mt-10">
				<Form id="sign-message__form" context={form} onSubmit={onSubmit}>
					<FormField className="relative">
						<FormLabel label="Signatory" />
						<Input type="text" disabled />
						<div className="absolute top-0 mt-10 ml-4">
							<Circle avatarId="test" size="small" noShadow />
							<span className="ml-3 font-semibold ">{signatoryAddress}</span>
						</div>
					</FormField>
					<FormField name="message">
						<FormLabel label="Message" />
						<Input type="text" reference={register({ required: true })} error={errors["message"]} />
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
		</div>
	);
};
