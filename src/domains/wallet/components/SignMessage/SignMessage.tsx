import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { TextArea } from "app/components/TextArea";
import { useEnvironmentContext } from "app/contexts";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { createRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type SignMessageProps = {
	profileId: string;
	walletId: string;
	signatoryAddress: string;
	isOpen: boolean;
	onClose?: () => void;
	onCancel?: () => void;
};

type SignedMessageProps = { message: string; signatory: string; signature: string };

const initialState = {
	message: "",
	signatory: "",
	signature: "",
};

export const SignMessage = ({ profileId, walletId, signatoryAddress, isOpen, onClose, onCancel }: SignMessageProps) => {
	const [isSigned, setIsSigned] = useState(false);
	const [signedMessage, setSignedMessage] = useState<SignedMessageProps>(initialState);

	const { env } = useEnvironmentContext();
	const form = useForm({ mode: "onChange" });
	const { t } = useTranslation();

	const { register } = form;
	const messageRef = createRef();

	useEffect(() => {
		if (!isOpen) {
			setSignedMessage(initialState);
			setIsSigned(false);
		}
	}, [isOpen]);

	const handleSubmit = async ({ message, mnemonic }: Record<string, any>) => {
		const profile = env?.profiles().findById(profileId);
		const wallet = profile?.wallets().findById(walletId);

		const signedMessageResult = await wallet?.message().sign({
			message,
			mnemonic,
		});

		setSignedMessage(signedMessageResult);
		setIsSigned(true);
	};

	const SignFormRender = (
		<Form context={form} onSubmit={handleSubmit} data-testid="SignMessage__form">
			<FormField name="signatory-address">
				<FormLabel label={t("WALLETS.SIGNATORY")} />
				<div className="relative">
					<Input type="text" disabled />
					<div className="flex absolute top-0 items-center mt-2 ml-4">
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
				<Button variant="secondary" onClick={onCancel} data-testid="SignMessage__cancel">
					{t("COMMON.CANCEL")}
				</Button>
				<Button type="submit" data-testid="SignMessage__submit-button">
					{t("WALLETS.MODAL_SIGN_MESSAGE.SIGN")}
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
						<Avatar address={signedMessage.signatory} />
					</div>
				}
			>
				<Address address={signedMessage.signatory} />
			</TransactionDetail>
			<TransactionDetail border label={t("COMMON.MESSAGE")} className="text-lg break-all">
				{signedMessage.message}
			</TransactionDetail>
			<TransactionDetail border label={t("COMMON.SIGNATURE")}>
				<TextArea
					className="mt-2 rounded-lg"
					name="signature"
					wrap="hard"
					ref={messageRef}
					defaultValue={JSON.stringify(signedMessage)}
				/>
			</TransactionDetail>

			<div className="flex justify-end pb-5 mt-3">
				<Clipboard data={JSON.stringify(signedMessage)}>
					<Button variant="secondary" data-testid="SignMessage__copy-button">
						<Icon name="Copy" />
						<span>{t("WALLETS.MODAL_SIGN_MESSAGE.COPY_SIGNATURE")}</span>
					</Button>
				</Clipboard>
			</div>
		</div>
	);

	const renderSignedMessageContent = () => (isSigned ? SignedMessageRender : SignFormRender);

	return (
		<Modal
			isOpen={isOpen}
			title={!isSigned ? t("WALLETS.MODAL_SIGN_MESSAGE.TITLE") : t("WALLETS.MODAL_SIGN_MESSAGE.SUCCESS_TITLE")}
			description={!isSigned ? t("WALLETS.MODAL_SIGN_MESSAGE.DESCRIPTION") : ""}
			onClose={onClose}
		>
			<div className={!isSigned ? "mt-8" : "mt-2"}>{renderSignedMessageContent()}</div>
		</Modal>
	);
};

SignMessage.defaultProps = {
	isOpen: false,
};
