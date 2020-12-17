import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";

// @TODO: rename and/or move all the "SendEntityRegistration" types and interfaces in here because they are not specific to AIP36 but used for everything

export type PasswordType = "mnemonic" | "password" | "ledger";

export type SendEntityResignationProps = {
	formDefaultData?: any;
};

export type StepProps = {
	senderWallet: ReadWriteWallet;
	delegate?: ReadOnlyWallet | any;
	fees: Contracts.TransactionFee;
	transaction?: Contracts.SignedTransactionData;
};
