import { Contracts } from "@arkecosystem/platform-sdk";
import { Wallet } from "@arkecosystem/platform-sdk-profiles";

export type RegistrationForm = {
	transactionDetails: ({
		transaction,
		translations,
	}: {
		transaction: Contracts.SignedTransactionData;
		translations: any;
	}) => void;
	signTransaction: ({ env, form, handleNext, profile, setTransaction, translations }: any) => Promise<void>;
	tabSteps: number;
	component: ({ activeTab, feeOptions, wallet }: { activeTab: number; feeOptions: any; wallet: Wallet }) => void;
};
