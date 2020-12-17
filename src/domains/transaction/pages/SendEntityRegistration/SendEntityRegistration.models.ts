import { Contracts } from "@arkecosystem/platform-sdk";
import { Enums, Environment, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { TFunction } from "i18next";
import { useForm } from "react-hook-form";

// @TODO: rename all the "SendEntityRegistration" types and interfaces in here because they are not specific to AIP36 but used for everything

export type ExtendedSignedTransactionData = Contracts.SignedTransactionData & {
	generatedAddress?: string;
};

export type SendEntityRegistrationType = {
	label: string;
	value: string;
	type?: Enums.EntityType;
};

export type SendEntityRegistrationDetailsOptions = {
	transaction: ExtendedSignedTransactionData;
	translations: TFunction;
	wallet: ReadWriteWallet;
};

export type SendEntityRegistrationComponent = {
	title: string;
	activeTab: number;
	fees: Contracts.TransactionFee;
	wallet: ReadWriteWallet;
	profile: Profile;
};

export type SendEntityRegistrationSignOptions = {
	env: Environment;
	form: ReturnType<typeof useForm>;
	profile: Profile;
	type?: Enums.EntityType;
};

export type SendEntityRegistrationForm = {
	transactionDetails: ({ transaction, translations, wallet }: SendEntityRegistrationDetailsOptions) => JSX.Element;

	signTransaction: (options: SendEntityRegistrationSignOptions) => Promise<Contracts.SignedTransactionData>;

	tabSteps: number;

	formFields: string[];

	component: ({ activeTab, fees, wallet }: SendEntityRegistrationComponent) => JSX.Element;
};
