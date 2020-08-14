// Modal Types
import { IpfsDetail } from "domains/transaction/components/IpfsDetail";
import { MultiPaymentDetail } from "domains/transaction/components/MultiPaymentDetail";
import { MultiSignatureDetail } from "domains/transaction/components/MultiSignatureDetail";
import { TransferDetail } from "domains/transaction/components/TransferDetail";
import { VoteDetail } from "domains/transaction/components/VoteDetail";
// Component
import React from "react";

type TransactionDetailModalProps = {
	isOpen: boolean;
	transactionItem?: any;
	onClose?: any;
	onCancel?: any;
};

export const TransactionDetailModal = ({ isOpen, transactionItem, onClose, onCancel }: TransactionDetailModalProps) => {
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
		case "vote":
		case "unvote":
			TransactionModal = VoteDetail;
			break;

		default:
			break;
	}

	if (!TransactionModal) {
		// Throw error or show amodal that xyz is not supported
		throw new Error(`Transaction type [${transactionType}] is not supported.`);

		return null;
	}

	return <TransactionModal isOpen={isOpen} onClose={onClose} onCancel={onCancel} transaction={transactionItem} />;
};

TransactionDetailModal.defaultProps = {
	isOpen: false,
};
