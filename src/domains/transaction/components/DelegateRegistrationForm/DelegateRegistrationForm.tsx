import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail, TransactionFee } from "domains/transaction/components/TransactionDetail";
import { SendEntityRegistrationForm } from "domains/transaction/pages/SendEntityRegistration/SendEntityRegistration.models";
import React from "react";

import { FormStep, ReviewStep } from "./steps";

const component = ({ activeTab, fees, wallet }: { activeTab: number; fees: any; wallet: ReadWriteWallet }) => (
	<Tabs activeId={activeTab}>
		<TabPanel tabId={2}>
			<FormStep fees={fees} wallet={wallet} />
		</TabPanel>
		<TabPanel tabId={3}>
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
					<Icon name="Delegate" width={25} height={25} />
				</Circle>
			}
		>
			{translations("TRANSACTION.TRANSACTION_TYPES.DELEGATE_REGISTRATION")}
		</TransactionDetail>

		<TransactionDetail label={translations("TRANSACTION.DELEGATE_NAME")}>
			{transaction.data().asset.delegate.username}
		</TransactionDetail>

		<TransactionFee currency={wallet.currency()} value={transaction.fee()} paddingPosition="top" />
	</>
);

component.displayName = "DelegateRegistrationForm";
transactionDetails.displayName = "DelegateRegistrationFormTransactionDetails";

export const DelegateRegistrationForm: SendEntityRegistrationForm = {
	tabSteps: 2,
	component,
	transactionDetails,
	formFields: ["username"],

	signTransaction: async ({ env, form, handleNext, profile, setTransaction, translations }: any) => {
		const { clearErrors, getValues, setError, setValue } = form;

		clearErrors("mnemonic");
		const { fee, mnemonic, secondMnemonic, senderAddress, username } = getValues();
		const senderWallet = profile.wallets().findByAddress(senderAddress);

		try {
			const transactionId = await senderWallet.transaction().signDelegateRegistration({
				fee: /* istanbul ignore next */ fee?.value || fee,
				from: senderAddress,
				sign: {
					mnemonic,
					secondMnemonic,
				},
				data: {
					username,
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
