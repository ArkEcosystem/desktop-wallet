import { Contracts } from "@arkecosystem/platform-sdk";
import { Environment, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { TFunction } from "i18next";
import { useForm } from "react-hook-form";

export type SendEntityRegistrationType = {
	label: string;
	value: string;
};

export type SendEntityRegistrationDetailsOptions = {
	transaction: Contracts.SignedTransactionData;
	translations: TFunction;
};

export type SendEntityRegistrationComponent = {
	activeTab: number;
	feeOptions: Record<string, any>;
	wallet: ReadWriteWallet;
};

export type SendEntityRegistrationForm = {
	transactionDetails: ({ transaction, translations }: SendEntityRegistrationDetailsOptions) => JSX.Element;

	signTransaction: (options: {
		env: Environment;
		form: ReturnType<typeof useForm>;
		handleNext: () => void;
		profile: Profile;
		setTransaction: (transaction: Contracts.SignedTransactionData) => void;
		translations: TFunction;
	}) => Promise<void>;

	tabSteps: number;

	formFields: string[];

	component: ({ activeTab, feeOptions, wallet }: SendEntityRegistrationComponent) => JSX.Element;
};
