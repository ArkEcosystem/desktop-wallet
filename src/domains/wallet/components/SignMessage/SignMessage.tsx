import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputAddonStart, InputGroup, InputPassword } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { TextArea } from "app/components/TextArea";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useValidation } from "app/hooks";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { createRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useMessageSigner } from "./hooks/use-message-signer";

type SignMessageProps = {
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

export const SignMessage = ({ isOpen, onClose, onCancel }: SignMessageProps) => {
	const [isSigned, setIsSigned] = useState(false);
	const [isAwaitingLedger, setIsAwaitingLedger] = useState(false);

	const [signedMessage, setSignedMessage] = useState<SignedMessageProps>(initialState);

	const { env } = useEnvironmentContext();
	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { formState, register } = form;

	const messageRef = createRef();

	const profile = useActiveProfile();
	const wallet = useActiveWallet();

	const { sign } = useMessageSigner(profile);

	const isLedger = wallet.isLedger();
	const { authentication } = useValidation();

	useEffect(() => {
		if (!isOpen) {
			setSignedMessage(initialState);
			setIsSigned(false);
		}
	}, [isOpen]);

	const handleSubmit = async ({ message, mnemonic }: Record<string, any>) => {
		if (isLedger) {
			setIsAwaitingLedger(true);
		}

		const signedMessageResult = await sign(wallet, message, mnemonic);

		setSignedMessage(signedMessageResult);

		setIsSigned(true);

		if (isLedger) {
			setIsAwaitingLedger(false);
		}
	};

	const SignFormRender = (
		<div className="mt-8">
			<Form context={form} onSubmit={handleSubmit} data-testid="SignMessage__form">
				<FormField name="signatory-address">
					<FormLabel label={t("WALLETS.SIGNATORY")} />
					<InputGroup>
						<InputAddonStart>
							<Avatar address={wallet.address()} size="sm" className="ml-4" noShadow />
						</InputAddonStart>
						<Input value={wallet.address()} className="font-semibold pl-15" disabled />
					</InputGroup>
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
				</FormField>

				{isLedger && isAwaitingLedger && <LedgerConfirmation />}

				{!isLedger && (
					<FormField name="mnemonic">
						<FormLabel label={t("COMMON.YOUR_PASSPHRASE")} />
						<InputPassword
							ref={register(authentication.mnemonic(wallet.coin(), wallet.address()))}
							data-testid="SignMessage__mnemonic-input"
						/>
					</FormField>
				)}

				<div className="flex justify-end space-x-3">
					<Button variant="secondary" onClick={onCancel} data-testid="SignMessage__cancel">
						{t("COMMON.CANCEL")}
					</Button>
					<Button disabled={!formState.isValid} type="submit" data-testid="SignMessage__submit-button">
						{t("WALLETS.MODAL_SIGN_MESSAGE.SIGN")}
					</Button>
				</div>
			</Form>
		</div>
	);

	const SignedMessageRender = (
		<div className="mt-2">
			<TransactionDetail
				border={false}
				label={t("WALLETS.SIGNATORY")}
				extra={
					<div className="flex items-center -space-x-2">
						<Circle size="lg" className="border-theme-text">
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
						<Avatar size="lg" address={signedMessage.signatory} />
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

	const renderContent = () => (isSigned ? SignedMessageRender : SignFormRender);

	return (
		<Modal
			isOpen={isOpen}
			title={!isSigned ? t("WALLETS.MODAL_SIGN_MESSAGE.TITLE") : t("WALLETS.MODAL_SIGN_MESSAGE.SUCCESS_TITLE")}
			description={!isSigned ? t("WALLETS.MODAL_SIGN_MESSAGE.DESCRIPTION") : ""}
			onClose={onClose}
		>
			{renderContent()}
		</Modal>
	);
};

SignMessage.defaultProps = {
	isOpen: false,
};
