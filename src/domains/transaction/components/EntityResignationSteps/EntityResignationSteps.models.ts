import { Contracts } from "@arkecosystem/platform-sdk";

export type EntityResignationStepProps = {
	fees: Contracts.TransactionFee;
	transaction?: Contracts.SignedTransactionData;
	entity: any;
};
