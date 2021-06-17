import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
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
		<TransactionDetail
			label={translations("TRANSACTION.TYPE")}
			extra={
				<Circle className="border-theme-text" size="lg">
					<Icon name="Multisig" width={20} height={20} />
				</Circle>
			}
		>
			{translations("TRANSACTION.TRANSACTION_TYPES.MULTI_SIGNATURE")}
		</TransactionDetail>

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
	const { fee, minParticipants, participants, senderAddress } = getValues();
	const senderWallet = profile.wallets().findByAddress(senderAddress);

	const publicKeys = (participants as Participant[]).map((item) => item.publicKey);

	const signatory = await senderWallet!
		.coin()
		.signatory()
		.multiSignature(+minParticipants, Array.from(publicKeys));

	const uuid = await senderWallet!.transaction().signMultiSignature({
		nonce: senderWallet!.nonce().plus(1).toString(),
		fee,
		signatory,
		data: {
			publicKeys: Array.from(publicKeys),
			min: +minParticipants,
			senderPublicKey: senderWallet!.publicKey(),
		},
	});

	const { accepted, rejected, errors } = await senderWallet!.transaction().broadcast(uuid);

	handleBroadcastError({ accepted, rejected, errors });

	const transactionId = accepted[0];

	await senderWallet!.transaction().sync();
	await senderWallet!.transaction().addSignature(transactionId, signatory);

	await env.persist();

	const transaction: ExtendedSignedTransactionData = senderWallet!.transaction().transaction(transactionId);

	transaction.generatedAddress = (
		await senderWallet!.coin().address().fromMultiSignature(minParticipants, publicKeys)
	).address;
	return transaction;
};

export const MultiSignatureRegistrationForm: SendRegistrationForm = {
	tabSteps: 2,
	component: StepsComponent,
	transactionDetails,
	formFields: ["participants", "minParticipants"],

	signTransaction,
};
