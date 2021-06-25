import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";

interface PendingTransaction {
	transaction: DTO.ExtendedConfirmedTransactionData | DTO.ExtendedSignedTransactionData;
	hasBeenSigned: boolean;
	isAwaitingConfirmation: boolean;
	isAwaitingOurSignature: boolean;
	isAwaitingOtherSignatures: boolean;
}

interface Properties {
	wallet: Contracts.IReadWriteWallet;
	onClick?: (transaction: DTO.ExtendedSignedTransactionData) => void;
	onPendingTransactionClick?: (transaction: DTO.ExtendedConfirmedTransactionData) => void;
}

export type {
	PendingTransaction,
	Properties,
}
