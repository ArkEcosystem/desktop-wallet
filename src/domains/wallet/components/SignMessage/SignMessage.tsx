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
import { useLedgerContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useValidation } from "app/hooks";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import { LedgerWaitingDevice } from "domains/wallet/components/Ledger/LedgerWaitingDevice";
import React, { createRef, useEffect, useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useMessageSigner } from "./hooks/use-message-signer";

type SignMessageProps = {
	isOpen: boolean;
	onClose?: () => void;
	onCancel?: () => void;
};

type SignedMessageProps = { message: string; signatory: string; signature: string };

const initialState: SignedMessageProps = {
	message: "",
	signatory: "",
	signature: "",
};

export const SignMessage = ({ isOpen, onClose, onCancel }: SignMessageProps) => {
	const [isAwaitingLedger, setIsAwaitingLedger] = useState(false);
	const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);

	const [signedMessage, setSignedMessage] = useState<SignedMessageProps>(initialState);

	const isSigned = !!signedMessage.signature;

	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { formState, register, getValues, watch } = form;

	const messageRef = createRef();

	const profile = useActiveProfile();
	const wallet = useActiveWallet();
	const { abortConnectionRetry, isConnected } = useLedgerContext();

	const { sign } = useMessageSigner(profile);

	const isLedger = wallet.isLedger();
	const { authentication } = useValidation();

	useEffect(() => {
		if (!isOpen) {
			setSignedMessage(initialState);
		}
	}, [isOpen]);

	useEffect(
		() => () => {
			abortConnectionRetry();
		},
		[abortConnectionRetry],
	);

	useLayoutEffect(() => {
		if (wallet.isLedger() && !isConnected) {
			setIsAwaitingLedger(true);
		}
	}, [isConnected, setIsAwaitingLedger, wallet]);

	const handleSubmit = async ({ message, mnemonic }: Record<string, any>) => {
		if (isLedger) {
			setIsAwaitingConfirmation(true);
		}

		const signedMessageResult = await sign(wallet, message, mnemonic);

		setSignedMessage(signedMessageResult);
	};

	const handleLedgerModalClose = (hasDeviceAvailable: boolean) => {
		setIsAwaitingLedger(false);

		if (!hasDeviceAvailable) {
			onClose?.();
		}
	};

	const { message } = watch();

	const renderForm = (message: string) => {
		if (isLedger) {
			if (isAwaitingLedger) {
				return <LedgerWaitingDevice isOpen={true} onClose={handleLedgerModalClose} />;
			}

			if (isAwaitingConfirmation) {
				return (
					<LedgerConfirmation detailsHeading={null}>
						<TransactionDetail label={t("COMMON.MESSAGE")} border={false}>
							<span className="break-all">{message}</span>
						</TransactionDetail>
					</LedgerConfirmation>
				);
			}
		}

		return (
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
	};

	const renderSignedMessage = () => (
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

	return (
		<Modal
			isOpen={isOpen}
			title={!isSigned ? t("WALLETS.MODAL_SIGN_MESSAGE.TITLE") : t("WALLETS.MODAL_SIGN_MESSAGE.SUCCESS_TITLE")}
			description={!isSigned ? t("WALLETS.MODAL_SIGN_MESSAGE.DESCRIPTION") : ""}
			onClose={onClose}
		>
			{message}
			{isSigned ? renderSignedMessage() : renderForm(message)}
		</Modal>
	);
};

SignMessage.defaultProps = {
	isOpen: false,
};
