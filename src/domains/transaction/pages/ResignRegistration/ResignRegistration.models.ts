import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";

export type PasswordType = "mnemonic" | "password" | "ledger";

export type ResignRegistrationProps = {
	formDefaultData?: any;
	onDownload?: (transaction: Contracts.SignedTransactionData) => void;
	passwordType: PasswordType;
};

export type StepProps = {
	wallet: ReadWriteWallet;
	delegate: ReadOnlyWallet | any;
	fee: Contracts.TransactionFee;
	transaction?: Contracts.SignedTransactionData;
};
