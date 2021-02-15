import { SignedMessage } from "@arkecosystem/platform-sdk/dist/contracts";
import { WalletData } from "@arkecosystem/platform-sdk-profiles";
import { Form } from "app/components/Form";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext, useLedgerContext } from "app/contexts";
import { toasts } from "app/services";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { FormStep } from "./FormStep";
import { LedgerReviewMessage } from "./LedgerReview";
import { SignedStep } from "./SignedStep";

type SignMessageProps = {
	profileId: string;
	walletId: string;
	isOpen: boolean;
	onClose?: () => void;
	onCancel?: () => void;
};

export const SignMessage = ({ profileId, walletId, isOpen, onClose, onCancel }: SignMessageProps) => {
	const form = useForm({ mode: "onChange" });
	const { env } = useEnvironmentContext();

	const profile = useMemo(() => env?.profiles().findById(profileId), [env, profileId]);
	const wallet = useMemo(() => profile?.wallets().findById(walletId), [walletId, profile]);

	const [activeTab, setActiveTab] = useState("form");
	const [message, setMessage] = useState<string>();
	const [signedMessage, setSignedMessage] = useState<SignedMessage>();

	const { connect, abortConnectionRetry } = useLedgerContext();

	const handleSubmit = async ({ message, mnemonic }: Record<string, any>) => {
		setMessage(message);

		try {
			let signedMessageResult: SignedMessage;

			if (wallet.isLedger()) {
				setActiveTab("ledger");

				const path = wallet.data().get<string>(WalletData.LedgerPath);
				const bytes = Buffer.from(message, "utf8");
				await connect(wallet.coinId(), wallet.networkId());

				const signature = await wallet?.ledger().signMessage(path!, bytes);
				const signatory = wallet.publicKey()!;

				signedMessageResult = { message, signatory, signature };
			} else {
				signedMessageResult = await wallet?.message().sign({
					message,
					mnemonic,
				});
			}

			setSignedMessage(signedMessageResult);
			setActiveTab("signed");
		} catch {
			toasts.error("Failed");
			onClose?.();
		}
	};

	// eslint-disable-next-line arrow-body-style
	useEffect(() => {
		return () => {
			abortConnectionRetry();
		};
	}, [abortConnectionRetry]);

	return (
		<Modal isOpen={isOpen} title="" onClose={onClose}>
			<Form context={form} onSubmit={handleSubmit}>
				<Tabs activeId={activeTab}>
					<TabPanel tabId="form">
						<FormStep wallet={wallet} onCancel={onCancel} />
					</TabPanel>

					<TabPanel tabId="ledger">
						<LedgerReviewMessage message={message!} />
					</TabPanel>

					<TabPanel tabId="signed">
						<SignedStep signedMessage={signedMessage!} />
					</TabPanel>
				</Tabs>
			</Form>
		</Modal>
	);
};

SignMessage.defaultProps = {
	isOpen: false,
};
