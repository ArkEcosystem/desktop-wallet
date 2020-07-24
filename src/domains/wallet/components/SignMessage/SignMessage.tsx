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
import { useEnvironment } from "app/contexts";
import React, { createRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Props = {
	profileId: string;
	walletId: string;
	signatoryAddress: string;
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onSubmit?: any;
};

export const SignMessage = ({ profileId, walletId, signatoryAddress, isOpen, onClose, onCancel, onSubmit }: Props) => {
	const [isSigned, setIsSigned] = useState(false);

	const env = useEnvironment();
	const form = useForm({ mode: "onChange" });
	const { t } = useTranslation();

	const { register } = form;
	const messageRef = createRef();

	let signedMessage: any;

	const handleSubmit = async ({ message, mnemonic }: Record<string, any>) => {
		const profile = env?.profiles().findById(profileId);
		const wallet = profile?.wallets().findById(walletId);

		signedMessage = await wallet?.message().sign({
			message,
			mnemonic,
		});

		setIsSigned(true);

		onSubmit?.(signedMessage);
	};

	const SignFormRender = (
		<Form context={form} onSubmit={handleSubmit} data-testid="SignMessage__form">
			<FormField name="signatory-address">
				<FormLabel label={t("WALLETS.SIGNATORY")} />
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
				<FormLabel label={t("COMMON.MESSAGE")} />
				<Input
					type="text"
					ref={register({
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("COMMON.MESSAGE"),
						}).toString(),
					})}
					data-testid="SignMessage__message-input"
				/>
				<FormHelperText />
			</FormField>
			<FormField name="mnemonic">
				<FormLabel label={t("COMMON.YOUR_PASSPHRASE")} />
				<InputPassword
					ref={register({
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("COMMON.YOUR_PASSPHRASE"),
						}).toString(),
					})}
					data-testid="SignMessage__mnemonic-input"
				/>
				<FormHelperText />
			</FormField>
			<div className="flex justify-end space-x-3">
				<Button variant="plain" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" data-testid="SignMessage__submit-button">
					Sign
				</Button>
			</div>
		</Form>
	);

	const SignedMessageRender = (
		<div>
			<TransactionDetail
				border={false}
				label={t("WALLETS.SIGNATORY")}
				extra={
					<div className="flex items-center">
						<Circle className="-mr-2 border-black">
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
						<Avatar address={signedMessage?.signatory} size="sm" />
					</div>
				}
			>
				<Address address={signedMessage?.signatory} />
			</TransactionDetail>
			<TransactionDetail border label={t("COMMON.MESSAGE")} className="text-lg">
				{signedMessage?.message}
			</TransactionDetail>
			<TransactionDetail border label={t("COMMON.SIGNATURE")}>
				<TextArea
					className="mt-2 rounded-lg"
					name="signature"
					wrap="hard"
					ref={messageRef}
					defaultValue={JSON.stringify(signedMessage?.signature)}
				/>
			</TransactionDetail>

			<div className="flex justify-end pb-5 mt-3">
				<Button variant="plain">
					<Icon name="Copy" />
					<span>{t("WALLETS.MODAL_SIGN_MESSAGE.COPY_SIGNATURE")}</span>
				</Button>
			</div>
		</div>
	);

	const renderSignedMessageContent = () => (isSigned ? SignedMessageRender : SignFormRender);

	return (
		<Modal
			isOpen={isOpen}
			title={!isSigned ? t("WALLETS.MODAL_SIGN_MESSAGE.TITLE") : t("WALLETS.MODAL_SIGN_MESSAGE.SUCCESS_TITLE")}
			description={!isSigned ? t("WALLETS.MODAL_SIGN_MESSAGE.TITLE") : ""}
			onClose={onClose}
		>
			<div className={!isSigned ? "mt-8" : "mt-2"}>{renderSignedMessageContent()}</div>
		</Modal>
	);
};

SignMessage.defaultProps = {
	isOpen: false,
	isSigned: false,
};
