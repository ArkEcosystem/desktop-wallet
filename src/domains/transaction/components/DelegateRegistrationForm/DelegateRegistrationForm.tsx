import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail, TransactionFee, TransactionType } from "domains/transaction/components/TransactionDetail";
import { SendRegistrationForm } from "domains/transaction/pages/SendRegistration/SendRegistration.models";
import { handleBroadcastError } from "domains/transaction/utils";
import React from "react";

import { FormStep, ReviewStep } from ".";

const component = ({
	activeTab,
	fees,
	wallet,
	profile,
}: {
	activeTab: number;
	fees: any;
	wallet: Contracts.IReadWriteWallet;
	profile: Contracts.IProfile;
}) => (
	<Tabs activeId={activeTab}>
		<TabPanel tabId={1}>
			<FormStep fees={fees} wallet={wallet} profile={profile} />
		</TabPanel>
		<TabPanel tabId={2}>
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
	<>
		<TransactionType type="delegateRegistration" />

		<TransactionDetail label={translations("TRANSACTION.DELEGATE_NAME")}>
			{transaction.username()}
		</TransactionDetail>

		{/* @TODO: normalise fee in SDK */}
		<TransactionFee currency={wallet.currency()} value={transaction.fee()} paddingPosition="top" />
	</>
);

component.displayName = "DelegateRegistrationForm";
transactionDetails.displayName = "DelegateRegistrationFormTransactionDetails";

export const DelegateRegistrationForm: SendRegistrationForm = {
	component,
	formFields: ["username"],
	signTransaction: async ({ env, form, profile, signatory }: any) => {
		const { clearErrors, getValues } = form;

		clearErrors("mnemonic");
		const { fee, senderAddress, username } = getValues();
		const senderWallet = profile.wallets().findByAddress(senderAddress);

		const transactionId = await senderWallet.transaction().signDelegateRegistration({
			data: {
				username,
			},
			fee: +fee,
			signatory,
		});

		const response = await senderWallet.transaction().broadcast(transactionId);

		handleBroadcastError(response);

		await env.persist();

		return senderWallet.transaction().transaction(transactionId);
	},
	tabSteps: 2,
	transactionDetails,
};
