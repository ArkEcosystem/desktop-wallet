import { Contracts } from "@arkecosystem/platform-sdk";

export type EntityResignationStepProps = {
	entity: any;
	fees: Contracts.TransactionFee;
	transaction?: Contracts.SignedTransactionData;
};
