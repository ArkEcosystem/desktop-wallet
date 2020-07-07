// UI Elements
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "app/components/TransactionDetail";
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
			<FormField name="signatory-address">
				<FormLabel label="Signatory" />
				<div className="relative">
					<Input type="text" disabled />
					<div className="absolute top-0 flex items-center mt-2 ml-4">
						<div className="flex items-center">
							<Avatar address="test" size="sm" noShadow />
							<span className="ml-3 font-semibold ">{signatoryAddress}</span>
						</div>
					</div>
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
			<div className="flex justify-end space-x-3">
				<Button variant="plain">Cancel</Button>
				<Button data-testid="sign-message__sign-button" onClick={() => handleSign()}>
					Sign
				</Button>
			</div>
		</Form>
	);

	const MessageSigned = (
		<div>
			<TransactionDetail
				border={false}
				label="Signatory"
				extra={
					<div className="flex items-center">
						<Circle className="-mr-2 border-black">
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
						<Avatar address="test" size="sm" />
					</div>
				}
			>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
			</TransactionDetail>
			<TransactionDetail border label="Message" className="text-lg">
				Oleg Happy in the Oleg Bank
			</TransactionDetail>
			<TransactionDetail border label="Signature">
				<TextArea
					className="mt-2 rounded-lg"
					name="signature"
					wrap="hard"
					ref={messageRef}
					defaultValue={JSON.stringify(mockSignature)}
				/>
			</TransactionDetail>

			<div className="flex justify-end pb-5 mt-3">
				<Button variant="plain">
					<Icon name="Copy" />
					<span>Copy Signature</span>
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
			<div className="mt-2">{renderSignedMessageContent()}</div>
		</Modal>
	);
};

SignMessage.defaultProps = {
	isOpen: false,
	isSigned: false,
};
