import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";

export type SendEntityRegistrationType = {
	label: string;
	value: string;
};

export type SendEntityRegistrationForm = {
	transactionDetails: ({
		transaction,
		translations,
	}: {
		transaction: Contracts.SignedTransactionData;
		translations: any;
	}) => JSX.Element;

	signTransaction: ({ env, form, handleNext, profile, setTransaction, translations }: any) => Promise<void>;

	tabSteps: number;

	formFields: string[];

	component: ({ activeTab, fees, wallet }: { activeTab: number; fees: any; wallet: ReadWriteWallet }) => JSX.Element;
};
