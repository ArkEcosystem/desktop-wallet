// UI Elements
import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { TextArea } from "app/components/TextArea";
import React, { createRef } from "react";
import { useForm } from "react-hook-form";

type Props = {
	onSubmit?: any;
	isOpen: boolean;
	isSigned?: boolean;
	handleClose?: any;
	handleSign?: any;
	signatoryAddress: string;
};

const mockSignature = {
	publicKey: "03basda32b03s2df1as0csd32f1asd0asd21sv0asd5sa3d1as03d2as",
	signature:
		"304444354032424a3sd210a3s2d4as3d54as0321das03d777cas32f1as3d21as03v5ds4sd3asc045as35d4a03x24z3c5z4sd3as054cas65xv4cxz3v24zs30x24c3xz2v4zs03d54czdv54z3x5c40zx6v54z3df2c4zd0",
	message: "Xp879878687z6xc876Z*6cz87c68zx76c8x7zc68zx7cvsa7dc5as8d765as87d5sa8d7as65dsadasdsad",
};

export const SignMessage = ({ onSubmit, signatoryAddress, isOpen, isSigned, handleClose, handleSign }: Props) => {
	const form = useForm();
	const { register } = form;
	const messageRef = createRef();

	const SignForm = (
		<Form id="sign-message__form" context={form} onSubmit={onSubmit}>
			<FormField name="signatory-address" className="relative">
				<FormLabel label="Signatory" />
				<Input type="text" disabled />
				<div className="absolute top-0 flex items-center mt-8 ml-4">
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
				<Button
					data-testid="sign-message__sign-button"
					color="primary"
					variant="solid"
					size="large"
					className="ml-5"
					onClick={() => handleSign()}
				>
					Sign
				</Button>
			</div>
		</Form>
	);

	const MessageSigned = (
		<div>
			<div className="pb-5 mb-3 border-b border-dashed border-theme-neutral-300">
				<span className="font-semibold text-md text-theme-neutral-light">Signatory</span>
				<div className="flex items-center justify-between w-full mt-1">
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
					<div className="-mt-3">
						<Circle className="bg-theme-background border-theme-neutral-800">
							<Icon name="Delegate" width={20} height={20} />
						</Circle>
						<Circle avatarId="test" className="bg-theme-background"></Circle>
					</div>
				</div>
			</div>
			<div className="pb-5 mb-3 border-b border-dashed border-theme-neutral-300">
				<span className="font-semibold text-md text-theme-neutral-light">Message</span>
				<p className="w-3/4 text-xl font-bold text-theme-neutral-800 mt-1">{"Oleg Happy in the Oleg Bank"}</p>
			</div>
			<div>
				<span className="font-semibold text-md text-theme-neutral-light">Signature</span>
				<TextArea
					className="mt-2"
					name="signature"
					wrap="hard"
					ref={messageRef}
					defaultValue={JSON.stringify(mockSignature)}
				/>
			</div>
			<div className="flex items-center mt-5 pb-5">
				<Button color="primary" variant="plain" size="large">
					<div className="flex items-center justify-between px-1">
						<Icon name="Copy" />
						<span className="ml-2">Copy Signature</span>
					</div>
				</Button>
			</div>
		</div>
	);

	const renderSignedMessageContent = () => (isSigned ? MessageSigned : SignForm);

	return (
		<Modal
			isOpen={isOpen}
			title={!isSigned ? "Sign Message" : "Message Successfully Signed"}
			description={!isSigned ? "Insert a message below to sign using your private key" : ""}
			onClose={() => handleClose()}
		>
			<div className="mt-5">{renderSignedMessageContent()}</div>
		</Modal>
	);
};

SignMessage.defaultProps = {
	isOpen: false,
	isSigned: false,
};
