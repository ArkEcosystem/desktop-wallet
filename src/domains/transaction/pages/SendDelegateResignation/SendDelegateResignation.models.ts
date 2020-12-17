import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";

export type StepProps = {
	senderWallet: ReadWriteWallet;
	delegate?: ReadOnlyWallet | any;
	fees: Contracts.TransactionFee;
	transaction?: Contracts.SignedTransactionData;
};
