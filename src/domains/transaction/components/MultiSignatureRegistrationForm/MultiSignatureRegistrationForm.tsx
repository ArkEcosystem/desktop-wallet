import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import {
	SendEntityRegistrationComponent,
	SendEntityRegistrationDetailsOptions,
	SendEntityRegistrationForm,
	SendEntityRegistrationSignOptions,
} from "domains/transaction/pages/SendEntityRegistration/SendEntityRegistration.models";
import React from "react";

import { Participant } from "./components/AddParticipant/AddParticipant";
import { FormStep } from "./Step1";
import { ReviewStep } from "./Step2";

const StepsComponent = ({ activeTab, fees, wallet, profile }: SendEntityRegistrationComponent) => (
	<Tabs activeId={activeTab}>
		<TabPanel tabId={2}>
			<FormStep fees={fees} wallet={wallet} profile={profile} />
		</TabPanel>
		<TabPanel tabId={3}>
			<ReviewStep wallet={wallet} />
		</TabPanel>
	</Tabs>
);

const transactionDetails = ({ translations }: SendEntityRegistrationDetailsOptions) => (
	<TransactionDetail
		label={translations("TRANSACTION.TYPE")}
		extra={
			<div>
				<Circle className="border-black bg-theme-background" size="lg">
					<Icon name="Multisig" width={20} height={20} />
				</Circle>
			</div>
		}
	>
		{translations("TRANSACTION.PAGE_SECOND_SIGNATURE.REVIEW_STEP.TYPE")}
	</TransactionDetail>
);

StepsComponent.displayName = "MultiSignatureRegistrationForm";
transactionDetails.displayName = "MultiSignatureRegistrationFormTransactionDetails";

const submitForm = async ({
	env,
	form,
	handleNext,
	profile,
	setTransaction,
	translations,
}: SendEntityRegistrationSignOptions) => {
	const { clearErrors, getValues, setError, setValue } = form;

	clearErrors("mnemonic");
	const { fee, minParticipants, participants, mnemonic, senderAddress } = getValues();
	const senderWallet = profile.wallets().findByAddress(senderAddress);

	if (!senderWallet) {
		throw new Error();
	}

	const publicKeys = (participants as Participant[]).map((item) => item.publicKey);

	try {
		const transactionId = await senderWallet.transaction().signMultiSignature({
			fee,
			from: senderWallet.address(),
			sign: {
				multiSignature: {
					publicKeys: [...publicKeys],
					min: minParticipants,
				},
			},
			data: {
				publicKeys: [...publicKeys],
				min: minParticipants,
				senderPublicKey: senderWallet.publicKey(),
			},
		});

		await senderWallet.transaction().addSignature(transactionId, mnemonic);
		await env.persist();

		setTransaction(senderWallet.transaction().transaction(transactionId));

		handleNext();
	} catch (error) {
		console.error("Could not create transaction: ", error);

		setValue("mnemonic", "");
		setError("mnemonic", { type: "manual", message: translations("TRANSACTION.INVALID_MNEMONIC") });
	}
};

export const MultiSignatureRegistrationForm: SendEntityRegistrationForm = {
	tabSteps: 2,
	component: StepsComponent,
	transactionDetails,
	formFields: ["participants", "minParticipants"],

	signTransaction: submitForm,
};
