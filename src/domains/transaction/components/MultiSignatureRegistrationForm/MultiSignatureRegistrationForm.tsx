import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail, TransactionFee } from "domains/transaction/components/TransactionDetail";
import {
	ExtendedSignedTransactionData,
	SendRegistrationComponent,
	SendRegistrationDetailsOptions,
	SendRegistrationForm,
	SendRegistrationSignOptions,
} from "domains/transaction/pages/SendRegistration/SendRegistration.models";
import { handleBroadcastError } from "domains/transaction/utils";
import React from "react";

import { FormStep, ReviewStep } from ".";
import { Participant } from "./components/AddParticipant/AddParticipant";

const StepsComponent = ({ activeTab, fees, wallet, profile }: SendRegistrationComponent) => (
	<Tabs activeId={activeTab}>
		<TabPanel tabId={1}>
			<FormStep fees={fees} wallet={wallet} profile={profile} />
		</TabPanel>
		<TabPanel tabId={2}>
			<ReviewStep wallet={wallet} />
		</TabPanel>
	</Tabs>
);

const transactionDetails = ({ transaction, translations, wallet }: SendRegistrationDetailsOptions) => (
	<>
		<TransactionDetail label={translations("TRANSACTION.MULTISIGNATURE.GENERATED_ADDRESS")}>
			{transaction.generatedAddress}
		</TransactionDetail>

		<TransactionFee currency={wallet.currency()} value={transaction.fee()} paddingPosition="top" />
	</>
);

StepsComponent.displayName = "MultiSignatureRegistrationForm";
transactionDetails.displayName = "MultiSignatureRegistrationFormTransactionDetails";

const signTransaction = async ({ env, form, profile }: SendRegistrationSignOptions) => {
	const { clearErrors, getValues } = form;

	clearErrors("mnemonic");
	const { fee, minParticipants, participants, senderAddress, mnemonic } = getValues();
	const senderWallet = profile.wallets().findByAddress(senderAddress);

	const publicKeys = (participants as Participant[]).map((item) => item.publicKey);

	const uuid = await senderWallet!.transaction().signMultiSignature({
		data: {
			min: +minParticipants,
			publicKeys: [...publicKeys],
			senderPublicKey: senderWallet!.publicKey(),
		},
		fee: +fee,
		nonce: senderWallet!.nonce().plus(1).toString(),
		signatory: await senderWallet!
			.coin()
			.signatory()
			.multiSignature(+minParticipants, publicKeys),
	});

	const { accepted, rejected, errors } = await senderWallet!.transaction().broadcast(uuid);

	handleBroadcastError({ accepted, errors, rejected });

	const transactionId = accepted[0];

	await senderWallet!.transaction().sync();
	await senderWallet!.transaction().addSignature(
		transactionId,
		// @TODO: support WIF
		(await senderWallet?.signatory().mnemonic(mnemonic))!,
	);

	await env.persist();

	const transaction: ExtendedSignedTransactionData = senderWallet!.transaction().transaction(transactionId);

	transaction.generatedAddress = (
		await senderWallet!.coin().address().fromMultiSignature(minParticipants, publicKeys)
	).address;
	return transaction;
};

export const MultiSignatureRegistrationForm: SendRegistrationForm = {
	component: StepsComponent,
	formFields: ["participants", "minParticipants"],
	signTransaction,
	tabSteps: 2,

	transactionDetails,
};
