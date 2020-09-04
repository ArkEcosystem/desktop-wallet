import { File } from "@arkecosystem/platform-sdk-ipfs";
import { Enums } from "@arkecosystem/platform-sdk-profiles";
import { filter, isEmpty } from "@arkecosystem/utils";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { httpClient } from "app/services";
import {
	SendEntityRegistrationComponent,
	SendEntityRegistrationDetailsOptions,
	SendEntityRegistrationForm,
} from "domains/transaction/pages/SendEntityRegistration/SendEntityRegistration.models";
import React from "react";
import slugify from "slugify";

import { FormStep } from "./Step2";
import { ReviewStep } from "./Step3";

const component = ({ activeTab, wallet, fees }: SendEntityRegistrationComponent) => (
	<Tabs activeId={activeTab}>
		<TabPanel tabId={2}>
			<FormStep fees={fees} />
		</TabPanel>
		<TabPanel tabId={3}>
			<ReviewStep wallet={wallet} />
		</TabPanel>
	</Tabs>
);

const transactionDetails = ({ translations, transaction }: SendEntityRegistrationDetailsOptions) => (
	<>
		<TransactionDetail label={translations("TRANSACTION.IPFS_HASH")}>
			{transaction?.data().asset.data.ipfsData}
		</TransactionDetail>
	</>
);

component.displayName = "BusinessRegistrationForm";
transactionDetails.displayName = "BusinessRegistrationFormTransactionDetails";

// @TODO: There can be one generic AIP36 EntityRegistrationForm.
// There is no need for multiple components because, as stated in the AIP36 specifications, they all share the same structure.
export const BusinessRegistrationForm: SendEntityRegistrationForm = {
	tabSteps: 2,
	component,
	transactionDetails,
	formFields: ["ipfsData"],

	// eslint-disable-next-line @typescript-eslint/require-await
	signTransaction: async ({ handleNext, form, setTransaction, profile, env, translations }) => {
		const { getValues, setValue, setError } = form;
		const { fee, ipfsData, mnemonic, senderAddress } = getValues({ nest: true });
		const senderWallet = profile.wallets().findByAddress(senderAddress);

		const sanitizedData = filter(ipfsData, (item) => !isEmpty(item));

		try {
			const transactionId = await senderWallet!.transaction().signEntityRegistration({
				fee,
				from: senderAddress,
				sign: { mnemonic },
				data: {
					// @TODO: use this based on the user-selection of what they want to register.
					type: Enums.EntityType.Business,
					// @TODO: let the user choose what sub-type they wish to use.
					subType: Enums.EntitySubType.None,
					name: slugify(ipfsData.meta.displayName),
					ipfs: await new File(httpClient).upload(sanitizedData),
				},
			});

			await senderWallet!.transaction().broadcast(transactionId);

			await env.persist();

			setTransaction(senderWallet!.transaction().transaction(transactionId));

			handleNext();
		} catch (error) {
			console.error("Could not create transaction: ", error);

			setValue("mnemonic", "");
			setError("mnemonic", "manual", translations("TRANSACTION.INVALID_MNEMONIC"));
		}
	},
};
