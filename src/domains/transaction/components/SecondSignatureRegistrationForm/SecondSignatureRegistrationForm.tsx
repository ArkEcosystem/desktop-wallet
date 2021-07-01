import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionFee } from "domains/transaction/components/TransactionDetail";
import { SendRegistrationForm } from "domains/transaction/pages/SendRegistration/SendRegistration.models";
import { handleBroadcastError } from "domains/transaction/utils";
import React from "react";
import { TransactionFees } from "types";

import { BackupStep, GenerationStep, ReviewStep, VerificationStep } from ".";

const component = ({
	activeTab,
	fees,
	wallet,
	profile,
}: {
	activeTab: number;
	fees: TransactionFees;
	wallet: Contracts.IReadWriteWallet;
	profile: Contracts.IProfile;
}) => (
	<Tabs activeId={activeTab}>
		<TabPanel tabId={1}>
			<GenerationStep wallet={wallet} fees={fees} profile={profile} />
		</TabPanel>

		<TabPanel tabId={2}>
			<BackupStep />
		</TabPanel>

		<TabPanel tabId={3}>
			<VerificationStep />
		</TabPanel>

		<TabPanel tabId={4}>
			<ReviewStep wallet={wallet} />
		</TabPanel>
	</Tabs>
);

const transactionDetails = ({
	transaction,
	translations,
	wallet,
}: {
	transaction: DTO.ExtendedSignedTransactionData;
	translations: any;
	wallet: Contracts.IReadWriteWallet;
}) => (
	<TransactionFee currency={wallet.currency()} value={transaction.fee()} paddingPosition="top" />
);

component.displayName = "SecondSignatureRegistrationForm";
transactionDetails.displayName = "SecondSignatureRegistrationFormTransactionDetails";

export const SecondSignatureRegistrationForm: SendRegistrationForm = {
	component,
	formFields: ["secondMnemonic", "verification"],
	signTransaction: async ({ env, form, profile, signatory }: any) => {
		const { clearErrors, getValues } = form;

		clearErrors("mnemonic");
		const { fee, senderAddress, secondMnemonic } = getValues();
		const senderWallet = profile.wallets().findByAddress(senderAddress);

		const transactionId = await senderWallet.transaction().signSecondSignature({
			data: {
				mnemonic: secondMnemonic,
			},
			fee: +fee,
			signatory,
		});

		const response = await senderWallet.transaction().broadcast(transactionId);

		handleBroadcastError(response);

		await env.persist();

		return senderWallet.transaction().transaction(transactionId);
	},
	tabSteps: 4,

	transactionDetails,
};
