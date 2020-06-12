import React, { createRef } from "react";
import { useForm } from "react-hook-form";
// UI Elements
import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormLabel, FormHelperText } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { ListDivided } from "app/components/ListDivided";
import { Modal } from "app/components/Modal";
import { TextArea } from "app/components/TextArea";

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
	const { register, getValues } = form;
	const messageRef = createRef();

	const signedItems = [
		{
			isFloatingLabel: true,
			label: "Signatory",
			labelClass: "font-bold text-theme-neutral-light",
			content: (
				<div className="flex items-center justify-between w-full">
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
					<div className="-mt-3">
						<Circle className="-mr-2 border-theme-neutral-800">
							<Icon name="Delegate" width={20} height={20} />
						</Circle>
						<Circle avatarId="test" className="-mr-2"></Circle>
					</div>
				</div>
			),
		},
		{
			isFloatingLabel: true,
			label: "Message",
			labelClass: "font-bold text-theme-neutral-light -mt-5",
			content: (
				<span className="w-3/4 text-xl font-bold text-theme-neutral-800">{"Oleg Happy in the Oleg Bank"}</span>
			),
		},
		{
			isFloatingLabel: true,
			label: "Signature",
			labelClass: "font-bold text-theme-neutral-light -mt-5",
			content: (
				<TextArea name="signature" wrap="hard" ref={messageRef} defaultValue={JSON.stringify(mockSignature)} />
			),
		},
	];

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
		<div className="-mt-8">
			<ListDivided items={signedItems} />
			<div className="flex items-center mt-3">
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
