import { Contracts } from "@arkecosystem/platform-sdk";
import { Environment, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { TFunction } from "i18next";
import { useForm } from "react-hook-form";

export type RegistrationType = {
	label: string;
	value: string;
};

export type RegistrationTransactionDetailsOptions = {
	transaction: Contracts.SignedTransactionData;
	translations: TFunction;
};

export type RegistrationComponent = {
	activeTab: number;
	feeOptions: Record<string, any>;
	wallet: ReadWriteWallet;
};

export type RegistrationForm = {
	transactionDetails: ({ transaction, translations }: RegistrationTransactionDetailsOptions) => JSX.Element;

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

	component: ({
		activeTab,
		feeOptions,
		wallet,
	}: {
		activeTab: number;
		feeOptions: any;
		wallet: ReadWriteWallet;
	}) => JSX.Element;
};
