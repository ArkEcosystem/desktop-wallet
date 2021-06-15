import { Services } from "@arkecosystem/platform-sdk";
import { useActiveProfile } from "app/hooks";
import { SignMessage } from "domains/wallet/components/SignMessage";
import React, { useCallback, useState } from "react";

export const useSignMessageModal = ({ message, walletId }: { message: string; walletId: string }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [signedResult, setSignedResult] = useState<Services.SignedMessage | undefined>(undefined);
	const profile = useActiveProfile();

	const open = () => setIsOpen(true);
	const close = useCallback(() => setIsOpen(false), []);

	// eslint-disable-next-line arrow-body-style
	const ModalWrapper = useCallback(() => {
		return (
			<SignMessage
				profile={profile}
				walletId={walletId}
				isOpen={isOpen}
				messageText={message}
				onSign={setSignedResult}
				onCancel={close}
				onClose={close}
			/>
		);
	}, [isOpen, message, walletId, close, profile]);

	return [ModalWrapper, signedResult, { isOpen, open, close }];
};
