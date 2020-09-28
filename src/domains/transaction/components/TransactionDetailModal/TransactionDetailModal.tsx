import { ExtendedTransactionData, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { useActiveProfile } from "app/hooks/env";
import { DelegateRegistrationDetail } from "domains/transaction/components/DelegateRegistrationDetail";
import { IpfsDetail } from "domains/transaction/components/IpfsDetail";
import { MultiPaymentDetail } from "domains/transaction/components/MultiPaymentDetail";
import { MultiSignatureDetail } from "domains/transaction/components/MultiSignatureDetail";
import { SecondSignatureDetail } from "domains/transaction/components/SecondSignatureDetail";
import { TransferDetail } from "domains/transaction/components/TransferDetail";
import { VoteDetail } from "domains/transaction/components/VoteDetail";
import React from "react";

type TransactionDetailModalProps = {
	isOpen: boolean;
	transactionItem?: ExtendedTransactionData;
	onClose?: any;
};

export const TransactionDetailModal = ({ isOpen, transactionItem, onClose }: TransactionDetailModalProps) => {
	const activeProfile = useActiveProfile();

	const ticker = activeProfile.settings().get<string>(ProfileSetting.ExchangeCurrency, "")!;
	const walletAlias = activeProfile.wallets().findByAddress(transactionItem!.sender())?.alias();
	const recipientWalletAlias = activeProfile.wallets().findByAddress(transactionItem!.recipient())?.alias();

	const transactionType = transactionItem?.type();
	let TransactionModal;

	switch (transactionType) {
		case "transfer":
			TransactionModal = TransferDetail;
			break;
		case "multiSignature":
			TransactionModal = MultiSignatureDetail;
			break;
		case "multiPayment":
			TransactionModal = MultiPaymentDetail;
			break;
		case "ipfs":
			TransactionModal = IpfsDetail;
			break;
		case "delegateRegistration":
			TransactionModal = DelegateRegistrationDetail;
			break;
		case "vote":
		case "unvote":
			TransactionModal = VoteDetail;
			break;
		case "secondSignature":
			TransactionModal = SecondSignatureDetail;
			break;

		default:
			break;
	}

	if (!TransactionModal) {
		throw new Error(`Transaction type [${transactionType}] is not supported.`);
	}

	return (
		<TransactionModal
			isOpen={isOpen}
			transaction={transactionItem}
			ticker={ticker}
			walletAlias={walletAlias}
			recipientWalletAlias={recipientWalletAlias}
			onClose={onClose}
		/>
	);
};

TransactionDetailModal.defaultProps = {
	isOpen: false,
};
