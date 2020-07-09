export type Transaction = {
	id: string;
	type: string;
	timestamp: string;
	confirmations: string;
	sender: string;
	recipient: string;
	recipients?: { amount: string; address: string }[];
	amount: string;
	fee: string;
	isSent: boolean;
	vendorField?: string;
	isUnvote?: boolean;
	isSignaturePending?: boolean;
	isMultiSignature?: boolean;
};

export type TransactionStatus = "confirmed" | "pending" | "actionRequired";
