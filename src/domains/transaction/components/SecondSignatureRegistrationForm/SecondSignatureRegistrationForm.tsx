import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail, TransactionFee } from "domains/transaction/components/TransactionDetail";
import { SendEntityRegistrationForm } from "domains/transaction/pages/SendEntityRegistration/SendEntityRegistration.models";
import React from "react";

import { GenerationStep } from "./Step1";
import { BackupStep } from "./Step2";
import { VerificationStep } from "./Step3";
import { ReviewStep } from "./Step4";

const component = ({
	activeTab,
	fees,
	wallet,
}: {
	activeTab: number;
	fees: Contracts.TransactionFee;
	wallet: ReadWriteWallet;
}) => (
	<Tabs activeId={activeTab}>
		<TabPanel tabId={2}>
			<GenerationStep wallet={wallet} fees={fees} />
		</TabPanel>
		<TabPanel tabId={3}>
			<BackupStep />
		</TabPanel>
		<TabPanel tabId={4}>
			<VerificationStep />
		</TabPanel>
		<TabPanel tabId={5}>
			<ReviewStep wallet={wallet} />
		</TabPanel>
	</Tabs>
);

const transactionDetails = ({
	transaction,
	translations,
	wallet,
}: {
	transaction: Contracts.SignedTransactionData;
	translations: any;
	wallet: ReadWriteWallet;
}) => (
	<>
		<TransactionDetail
			label={translations("TRANSACTION.TRANSACTION_TYPE")}
			extra={
				<Circle className="border-theme-text" size="lg">
					<Icon name="Key" width={20} height={20} />
				</Circle>
			}
		>
			{translations("TRANSACTION.TRANSACTION_TYPES.SECOND_SIGNATURE")}
		</TransactionDetail>

		<TransactionFee currency={wallet.currency()} value={transaction.fee()} paddingPosition="top" />
	</>
);

component.displayName = "SecondSignatureRegistrationForm";
transactionDetails.displayName = "SecondSignatureRegistrationFormTransactionDetails";

export const SecondSignatureRegistrationForm: SendEntityRegistrationForm = {
	tabSteps: 4,
	component,
	transactionDetails,
	formFields: ["secondMnemonic", "verification"],

	signTransaction: async ({ env, form, handleNext, profile, setTransaction, translations }: any) => {
		const { clearErrors, getValues, setError, setValue } = form;

		clearErrors("mnemonic");
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
			setError("mnemonic", { type: "manual", message: translations("TRANSACTION.INVALID_MNEMONIC") });
		}
	},
};
