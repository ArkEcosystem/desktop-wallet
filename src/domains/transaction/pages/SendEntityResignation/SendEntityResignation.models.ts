import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";

export type PasswordType = "mnemonic" | "password" | "ledger";

export type SendEntityResignationProps = {
	formDefaultData?: any;
	onDownload?: (transaction: Contracts.SignedTransactionData) => void;
};

export type StepProps = {
	senderWallet: ReadWriteWallet;
	delegate?: ReadOnlyWallet | any;
	fees: Contracts.TransactionFee;
	transaction?: Contracts.SignedTransactionData;
};
