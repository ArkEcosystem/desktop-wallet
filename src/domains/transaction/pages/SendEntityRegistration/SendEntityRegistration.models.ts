import { Contracts } from "@arkecosystem/platform-sdk";
import { Enums, Environment, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { TFunction } from "i18next";
import { useForm } from "react-hook-form";

export type SendEntityRegistrationType = {
	label: string;
	value: string;
	type?: Enums.EntityType;
};

export type SendEntityRegistrationDetailsOptions = {
	transaction: Contracts.SignedTransactionData;
	translations: TFunction;
};

export type SendEntityRegistrationComponent = {
	activeTab: number;
	fees: Contracts.TransactionFee;
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
		type?: Enums.EntityType;
	}) => Promise<void>;

	tabSteps: number;

	formFields: string[];

	component: ({ activeTab, fees, wallet }: SendEntityRegistrationComponent) => JSX.Element;
};
