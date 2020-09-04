import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { RegistrationForm } from "domains/transaction/pages/Registration/Registration.models";
import React from "react";

import { GenerationStep } from "./Step1";
import { BackupStep } from "./Step2";
import { VerificationStep } from "./Step3";
import { ReviewStep } from "./Step4";

const component = ({
	activeTab,
	feeOptions,
	wallet,
}: {
	activeTab: number;
	feeOptions: any;
	wallet: ReadWriteWallet;
}) => (
	<Tabs activeId={activeTab}>
		<TabPanel tabId={2}>
			<GenerationStep wallet={wallet} feeOptions={feeOptions} />
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

const transactionDetails = ({ translations }: { transaction: Contracts.SignedTransactionData; translations: any }) => (
	<TransactionDetail
		label={translations("TRANSACTION.TYPE")}
		extra={
			<div>
				<Circle className="border-black bg-theme-background" size="lg">
					<Icon name="Key" width={20} height={20} />
				</Circle>
			</div>
		}
	>
		{translations("TRANSACTION.PAGE_SECOND_SIGNATURE.REVIEW_STEP.TYPE")}
	</TransactionDetail>
);

component.displayName = "SecondSignatureRegistrationForm";
transactionDetails.displayName = "SecondSignatureRegistrationFormTransactionDetails";

export const SecondSignatureRegistrationForm: RegistrationForm = {
	tabSteps: 4,
	component,
	transactionDetails,
	formFields: ["secondMnemonic", "verification"],

	signTransaction: async ({ env, form, handleNext, profile, setTransaction, translations }: any) => {
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
