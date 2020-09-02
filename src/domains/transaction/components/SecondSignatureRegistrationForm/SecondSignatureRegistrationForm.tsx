import { Contracts } from "@arkecosystem/platform-sdk";
import { RegistrationForm } from "domains/transaction/pages/Registration/Registration.models";
import React from "react";

const component = () => <div>Second Signature Registration</div>;

const transactionDetails = ({
	transaction,
	translations,
}: {
	transaction: Contracts.SignedTransactionData;
	translations: any;
}) => <div />;

component.displayName = "SecondSignatureRegistrationForm";
transactionDetails.displayName = "SecondSignatureRegistrationFormTransactionDetails";

export const SecondSignatureRegistrationForm: RegistrationForm = {
	tabSteps: 2,
	component,
	transactionDetails,
	formFields: ["secondMnemonic"],

	signTransaction: async ({ env, form, handleNext, profile, setTransaction, translations }) => {
		const { clearError, getValues, setError, setValue } = form;

		clearError("mnemonic");
		const { fee, mnemonic, senderAddress, secondMnemonic } = getValues();
		const senderWallet = profile.wallets().findByAddress(senderAddress);

		try {
			const transactionId = await senderWallet.transaction().signSecondSignature({
				fee,
				from: senderAddress,
				sign: {
					mnemonic,
				},
				data: {
					mnemonic: secondMnemonic,
				},
			});

			await senderWallet.transaction().broadcast(transactionId);

			await env.persist();

			setTransaction(senderWallet.transaction().transaction(transactionId));

			handleNext();
		} catch (error) {
			console.error("Could not create transaction: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", "manual", translations("TRANSACTION.INVALID_MNEMONIC"));
		}
	},
};
