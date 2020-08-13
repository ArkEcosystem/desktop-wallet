// Modal Types
import { IpfsDetail } from "domains/transaction/components/IpfsDetail";
import { MultiPaymentDetail } from "domains/transaction/components/MultiPaymentDetail";
import { MultiSignatureDetail } from "domains/transaction/components/MultiSignatureDetail";
import { TransferDetail } from "domains/transaction/components/TransferDetail";
import { VoteDetail } from "domains/transaction/components/VoteDetail";
// Component
import React from "react";
import { useTranslation } from "react-i18next";

type TransactionDetailModalProps = {
	isOpen: boolean;
	transactionItem?: any;
	onClose?: any;
	onCancel?: any;
};

export const TransactionDetailModal = ({ isOpen, transactionItem, onClose, onCancel }: TransactionDetailModalProps) => {
	const { t } = useTranslation();
	const transactionType = transactionItem?.type();
	console.log({ transactionType });
	let TransactionModal;

	switch (transactionItem?.type()) {
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
			TransactionModal = VoteDetail;
			break;

		default:
			return null;
	}

	return <TransactionModal isOpen={isOpen} onClose={onClose} onCancel={onCancel} />;
};

TransactionDetailModal.defaultProps = {
	isOpen: false,
};
