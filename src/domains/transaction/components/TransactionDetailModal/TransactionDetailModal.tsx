import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { DelegateRegistrationDetail } from "domains/transaction/components/DelegateRegistrationDetail";
import { DelegateResignationDetail } from "domains/transaction/components/DelegateResignationDetail";
import { IpfsDetail } from "domains/transaction/components/IpfsDetail";
import { LegacyMagistrateDetail } from "domains/transaction/components/LegacyMagistrateDetail";
import { MultiPaymentDetail } from "domains/transaction/components/MultiPaymentDetail";
import { MultiSignatureRegistrationDetail } from "domains/transaction/components/MultiSignatureDetail";
import { SecondSignatureDetail } from "domains/transaction/components/SecondSignatureDetail";
import { TransferDetail } from "domains/transaction/components/TransferDetail";
import { VoteDetail } from "domains/transaction/components/VoteDetail";
import React from "react";

interface TransactionDetailModalProperties {
	isOpen: boolean;
	transactionItem: DTO.ExtendedTransactionData;
	onClose?: any;
}

export const TransactionDetailModal = ({ isOpen, transactionItem, onClose }: TransactionDetailModalProperties) => {
	const transactionType = transactionItem.type();
	let TransactionModal;

	switch (transactionType) {
		case "transfer":
			TransactionModal = TransferDetail;
			break;
		case "multiSignature":
			TransactionModal = MultiSignatureRegistrationDetail;
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
		case "delegateResignation":
			TransactionModal = DelegateResignationDetail;
			break;
		case "vote":
		case "unvote":
		case "voteCombination":
			TransactionModal = VoteDetail;
			break;
		case "secondSignature":
			TransactionModal = SecondSignatureDetail;
			break;
		case "magistrate":
			TransactionModal = LegacyMagistrateDetail;
			break;

		default:
			break;
	}

	if (!TransactionModal) {
		throw new Error(`Transaction type [${transactionType}] is not supported.`);
	}

	return <TransactionModal isOpen={isOpen} transaction={transactionItem} onClose={onClose} />;
};

TransactionDetailModal.defaultProps = {
	isOpen: false,
};
