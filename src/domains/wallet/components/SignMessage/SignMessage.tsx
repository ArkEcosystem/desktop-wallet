import { SignedMessage } from "@arkecosystem/platform-sdk/dist/contracts";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useLedgerContext } from "app/contexts";
import { useActiveWallet } from "app/hooks";
import { toasts } from "app/services";
import { isNoDeviceError, isRejectionError } from "domains/transaction/utils";
import { LedgerWaitingApp, LedgerWaitingDevice } from "domains/wallet/components/Ledger";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormStep } from "./FormStep";
import { useMessageSigner } from "./hooks/use-message-signer";
import { LedgerConfirmationStep } from "./LedgerConfirmationStep";
import { SignedStep } from "./SignedStep";

type SignMessageProps = {
	isOpen: boolean;
	onClose?: () => void;
	onCancel?: () => void;
};

type SignedMessageProps = { message: string; signatory: string; signature: string };

const initialState: SignedMessage = {
	message: "",
	signatory: "",
	signature: "",
};

export const SignMessage = ({ isOpen, onClose, onCancel }: SignMessageProps) => {
	const [activeTab, setActiveTab] = useState("form");

	const [message, setMessage] = useState<string>();
	const [ledgerState, setLedgerState] = useState("awaitingDevice");

	const [signedMessage, setSignedMessage] = useState<SignedMessage>(initialState);

	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { formState } = form;

	const wallet = useActiveWallet();

	const { abortConnectionRetry, connect, isConnected, hasDeviceAvailable } = useLedgerContext();

	const abortRef = useRef(new AbortController());
	const { sign } = useMessageSigner();

	const isLedger = wallet.isLedger();

	useEffect(
		() => () => {
			abortConnectionRetry();
		},
		[abortConnectionRetry],
	);

	const handleSubmit = async ({ message, mnemonic }: Record<string, any>) => {
		setMessage(message);

		const abortSignal = abortRef.current?.signal;

		if (isLedger) {
			setActiveTab("ledger");

			try {
				await connect(wallet.network().coin(), wallet.networkId());
			} catch (error) {
				/* istanbul ignore else */
				if (isNoDeviceError(error)) {
					toasts.error(t("WALLETS.MODAL_LEDGER_WALLET.NO_DEVICE_FOUND"));
				}

				onCancel?.();
			}

			setLedgerState("awaitingConfirmation");
		}

		try {
			const signedMessageResult = await sign(wallet, message, mnemonic, {
				abortSignal,
			});

			setSignedMessage(signedMessageResult);

			setActiveTab("signed");
		} catch (error) {
			/* istanbul ignore else */
			if (isRejectionError(error)) {
				toasts.error(t("TRANSACTION.LEDGER_CONFIRMATION.REJECTED"));
			}

			onCancel?.();
		}
	};

	useEffect(() => {
		if (ledgerState === "awaitingDevice" && hasDeviceAvailable && !isConnected) {
			setLedgerState("awaitingApp");
		}
	}, [isConnected, hasDeviceAvailable, ledgerState]);

	const handleClose = () => {
		abortRef.current.abort();
		onClose?.();
	};

	if (activeTab === "ledger") {
		if (ledgerState === "awaitingDevice") {
			return <LedgerWaitingDevice isOpen={true} onClose={handleClose} />;
		}

		if (ledgerState === "awaitingApp") {
			return <LedgerWaitingApp isOpen={true} coinName={wallet.network().coin()} onClose={handleClose} />;
		}
	}

	return (
		<Modal isOpen={isOpen} title="" onClose={handleClose}>
			<Form context={form} onSubmit={handleSubmit}>
				<Tabs activeId={activeTab}>
					<TabPanel tabId="form">
						<FormStep wallet={wallet} />
					</TabPanel>

					<TabPanel tabId="ledger">
						{ledgerState === "awaitingConfirmation" && <LedgerConfirmationStep message={message!} />}
					</TabPanel>

					<TabPanel tabId="signed">
						<SignedStep signedMessage={signedMessage} />
					</TabPanel>

					{activeTab === "form" && (
						<div className="flex justify-end mt-8 space-x-3">
							<Button
								variant="secondary"
								onClick={() => onCancel?.()}
								data-testid="SignMessage__cancel-button"
							>
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
					)}

					{activeTab === "signed" && (
						<div className="flex justify-end mt-8 space-x-3">
							<Button
								variant="secondary"
								onClick={() => setActiveTab("form")}
								data-testid="SignMessage__back-button"
							>
								{t("COMMON.BACK")}
							</Button>

							<Clipboard data={JSON.stringify(signedMessage)}>
								<Button variant="secondary" data-testid="SignMessage__copy-button">
									<Icon name="Copy" />
									<span>{t("WALLETS.MODAL_SIGN_MESSAGE.COPY_SIGNATURE")}</span>
								</Button>
							</Clipboard>
						</div>
					)}
				</Tabs>
			</Form>
		</Modal>
	);
};

SignMessage.defaultProps = {
	isOpen: false,
};
