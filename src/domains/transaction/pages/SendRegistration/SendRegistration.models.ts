import { Signatories } from "@arkecosystem/platform-sdk";
import { Contracts, DTO, Environment } from "@arkecosystem/platform-sdk-profiles";
import { TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { TransactionFees } from "types";

export type ExtendedSignedTransactionData = DTO.ExtendedSignedTransactionData & {
	generatedAddress?: string;
};

export interface SendRegistrationDetailsOptions {
	transaction: ExtendedSignedTransactionData;
	translations: TFunction;
	wallet: Contracts.IReadWriteWallet;
}

export interface SendRegistrationComponent {
	activeTab: number;
	fees: TransactionFees;
	wallet: Contracts.IReadWriteWallet;
	profile: Contracts.IProfile;
}

export interface SendRegistrationSignOptions {
	env: Environment;
	form: ReturnType<typeof useForm>;
	profile: Contracts.IProfile;
	signatory: Signatories.Signatory;
}

export interface SendRegistrationForm {
	transactionDetails: ({ transaction, translations, wallet }: SendRegistrationDetailsOptions) => JSX.Element;

	signTransaction: (options: SendRegistrationSignOptions) => Promise<DTO.ExtendedSignedTransactionData>;

	tabSteps: number;

	formFields: string[];

	component: (properties: SendRegistrationComponent) => JSX.Element;
}
