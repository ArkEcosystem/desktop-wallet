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
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import { LedgerWaiting } from "domains/wallet/components/Ledger";
import React, { ChangeEvent, createRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LedgerReview } from "./";
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
	const [isAwaitingApp, setIsAwaitingApp] = useState(false);
	const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);
	const [isAwaitingLedger, setIsAwaitingLedger] = useState(false);

	const [isReady, setIsReady] = useState(false);

	const restoreDefaults = () => {
		setIsReady(false);
		setIsAwaitingConfirmation(false);
		setIsAwaitingApp(false);
	};

	const [signedMessage, setSignedMessage] = useState<SignedMessageProps>(initialState);

	const isSigned = !!signedMessage.signature;

	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { formState, register, setValue, unregister } = form;

	const messageRef = createRef();

	const profile = useActiveProfile();
	const wallet = useActiveWallet();

	const { abortConnectionRetry, connect, isConnected, hasDeviceAvailable } = useLedgerContext();

	const abortRef = useRef(new AbortController());
	const { sign } = useMessageSigner(profile);

	const isLedger = wallet.isLedger();
	const { authentication } = useValidation();

	useEffect(() => {
		if (isLedger) {
			register("connected", { required: true });
		}

		return () => {
			unregister("connected");
		};
	}, [isLedger, register, unregister]);

	useLayoutEffect(() => {
		if (isLedger && !isConnected) {
			setIsAwaitingLedger(true);
		}
	}, [isConnected, isLedger]);

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

	useEffect(() => {
		const run = async () => {
			try {
				await connect(wallet.network().coin(), wallet.networkId());
				setIsAwaitingApp(false);
				setIsReady(true);
			} catch {
				//
			}
		};

		if (isAwaitingApp) {
			run();
		}
	}, [connect, isAwaitingApp, wallet]);

	useEffect(() => {
		if (isConnected && isReady) {
			setValue("connected", true, { shouldDirty: true, shouldValidate: true });
		}
	}, [isConnected, isReady, setValue]);

	const handleSubmit = async ({ message, mnemonic }: Record<string, any>) => {
		const abortSignal = abortRef.current?.signal;

		if (isLedger) {
			setIsAwaitingConfirmation(true);
		}

		try {
			const signedMessageResult = await sign(wallet, message, mnemonic, {
				abortSignal,
			});

			setSignedMessage(signedMessageResult);
		} catch {
			//
		}

		restoreDefaults();
	};

	const handleCancel = () => {
		abortRef.current.abort();
		restoreDefaults();
		onCancel?.();
	};

	const handleClose = () => {
		abortRef.current.abort();
		restoreDefaults();
		onClose?.();
	};

	const renderForm = () => (
		<div className="mt-8">
			<Form context={form} onSubmit={handleSubmit} data-testid="SignMessage__form">
				{isAwaitingConfirmation ? (
					<LedgerReview />
				) : (
					<>
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
							<InputGroup>
								<Input
									ref={register({
										required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
											field: t("COMMON.MESSAGE"),
										}).toString(),
									})}
									onChange={(event: ChangeEvent<HTMLInputElement>) =>
										setValue("message", event.target.value, {
											shouldDirty: true,
											shouldValidate: true,
										})
									}
									data-testid="SignMessage__message-input"
								/>
							</InputGroup>
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
							<Button variant="secondary" onClick={handleCancel} data-testid="SignMessage__cancel">
								{t("COMMON.CANCEL")}
							</Button>

							<Button
								disabled={!formState.isValid}
								type="submit"
								data-testid="SignMessage__submit-button"
							>
								{t("WALLETS.MODAL_SIGN_MESSAGE.SIGN")}
							</Button>
						</div>
					</>
				)}
			</Form>
		</div>
	);

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

	if (!isOpen) {
		return <></>;
	}

	if (isLedger && !isSigned) {
		if (isAwaitingLedger && !isConnected) {
			return (
				<LedgerWaiting
					isOpen={true}
					onClose={(hasDeviceAvailable: boolean) => setIsAwaitingApp(hasDeviceAvailable)}
				/>
			);
		}

		if ((!isAwaitingLedger && !isConnected) || isAwaitingApp) {
			return <LedgerWaiting isOpen={true} subject="app" coinName={wallet.network().coin()} />;
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			title={!isSigned ? t("WALLETS.MODAL_SIGN_MESSAGE.TITLE") : t("WALLETS.MODAL_SIGN_MESSAGE.SUCCESS_TITLE")}
			description={!isSigned ? t("WALLETS.MODAL_SIGN_MESSAGE.DESCRIPTION") : ""}
			onClose={handleClose}
		>
			{isSigned ? renderSignedMessage() : renderForm()}
		</Modal>
	);
};

SignMessage.defaultProps = {
	isOpen: false,
};
