import { Contracts, Signatories } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts, Environment } from "@arkecosystem/platform-sdk-profiles";
import { TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { TransactionFees } from "types";

export type ExtendedSignedTransactionData = Contracts.SignedTransactionData & {
	generatedAddress?: string;
};

export interface SendRegistrationDetailsOptions {
	transaction: ExtendedSignedTransactionData;
	translations: TFunction;
	wallet: ProfileContracts.IReadWriteWallet;
}

export interface SendRegistrationComponent {
	activeTab: number;
	fees: TransactionFees;
	wallet: ProfileContracts.IReadWriteWallet;
	profile: ProfileContracts.IProfile;
}

export interface SendRegistrationSignOptions {
	env: Environment;
	form: ReturnType<typeof useForm>;
	profile: ProfileContracts.IProfile;
	signatory: Signatories.Signatory;
}

export interface SendRegistrationForm {
	transactionDetails: ({ transaction, translations, wallet }: SendRegistrationDetailsOptions) => JSX.Element;

	signTransaction: (options: SendRegistrationSignOptions) => Promise<Contracts.SignedTransactionData>;

	tabSteps: number;

	formFields: string[];

	component: (props: SendRegistrationComponent) => JSX.Element;
}
