import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";

export type PasswordType = "mnemonic" | "password" | "ledger";

export type SendEntityResignationProps = {
	formDefaultData?: any;
	onDownload?: (transaction: Contracts.SignedTransactionData) => void;
	passwordType: PasswordType;
};

// export type StepProps = {
// 	senderWallet?: ReadWriteWallet;
// 	delegate?: ReadOnlyWallet | any;
// 	transaction?: Contracts.SignedTransactionData;
// 	entity?: any;
// 	fee: Contracts.TransactionFee;
// 	type?: string | undefined;
// };

export type StepProps = {
	senderWallet: ReadWriteWallet;
	delegate: ReadOnlyWallet | any;
	fees: Contracts.TransactionFee;
	transaction?: Contracts.SignedTransactionData;
	senderWallet?: ReadWriteWallet;
};
