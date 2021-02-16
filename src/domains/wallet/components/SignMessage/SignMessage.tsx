import { SignedMessage } from "@arkecosystem/platform-sdk/dist/contracts";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useLedgerContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks";
import { LedgerWaiting } from "domains/wallet/components/Ledger";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

	const [isAwaitingApp, setIsAwaitingApp] = useState(false);
	const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);
	const [isAwaitingLedger, setIsAwaitingLedger] = useState(false);

	const [isReady, setIsReady] = useState(false);

	const restoreDefaults = () => {
		setIsReady(false);
		setIsAwaitingConfirmation(false);
		setIsAwaitingApp(false);
	};

	const [signedMessage, setSignedMessage] = useState<SignedMessage>(initialState);

	const isSigned = !!signedMessage.signature;

	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { formState, register, setValue, unregister } = form;

	const profile = useActiveProfile();
	const wallet = useActiveWallet();

	const { abortConnectionRetry, connect, isConnected, hasDeviceAvailable } = useLedgerContext();

	const abortRef = useRef(new AbortController());
	const { sign } = useMessageSigner(profile);

	const isLedger = wallet.isLedger();

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
			setActiveTab("ledger");
		}

		try {
			const signedMessageResult = await sign(wallet, message, mnemonic, {
				abortSignal,
			});

			setSignedMessage(signedMessageResult);
		} catch {
			//
		}

		setActiveTab("signed");
		restoreDefaults();
	};

	const handleBack = () => {
		setActiveTab("form");
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
		<Modal isOpen={isOpen} title="" onClose={handleClose}>
			<Form context={form} onSubmit={handleSubmit}>
				<Tabs activeId={activeTab}>
					<TabPanel tabId="form">
						<FormStep wallet={wallet} />
					</TabPanel>

					<TabPanel tabId="ledger">
						<LedgerConfirmationStep />
					</TabPanel>

					<TabPanel tabId="signed">
						<SignedStep signedMessage={signedMessage} />
					</TabPanel>

					<div className="flex justify-end mt-10 space-x-3">
						{activeTab === "form" && (
							<>
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
							</>
						)}

						{activeTab === "signed" && (
							<>
								<Button variant="secondary" onClick={handleBack} data-testid="SignMessage__cancel">
									{t("COMMON.BACK")}
								</Button>

								<Clipboard data={JSON.stringify(signedMessage)}>
									<Button variant="secondary" data-testid="SignMessage__copy-button">
										<Icon name="Copy" />
										<span>{t("WALLETS.MODAL_SIGN_MESSAGE.COPY_SIGNATURE")}</span>
									</Button>
								</Clipboard>
							</>
						)}
					</div>
				</Tabs>
			</Form>
		</Modal>
	);
};

SignMessage.defaultProps = {
	isOpen: false,
};
