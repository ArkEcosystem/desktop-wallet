import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet, WalletData } from "@arkecosystem/platform-sdk-profiles";

export type PasswordType = "mnemonic" | "password" | "ledger";

export type ResignRegistrationProps = {
	formDefaultData?: any;
	onDownload?: (transaction: Contracts.SignedTransactionData) => void;
	passwordType: PasswordType;
};

export type StepProps = {
	senderWallet: ReadWriteWallet;
	delegate: WalletData | any;
	fee: Contracts.TransactionFee;
	transaction?: Contracts.SignedTransactionData;
};
