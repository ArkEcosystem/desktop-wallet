import { File } from "@arkecosystem/platform-sdk-ipfs";
import { Enums, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { filter, isEmpty } from "@arkecosystem/utils";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useValidation } from "app/hooks/validations";
import { httpClient } from "app/services";
import {
	SendEntityRegistrationComponent,
	SendEntityRegistrationDetailsOptions,
	SendEntityRegistrationForm,
} from "domains/transaction/pages/SendEntityRegistration/SendEntityRegistration.models";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { FormStep, ReviewStep } from "./";
import { SentStep } from "./SentStep";

const FormStepsComponent = ({ activeTab, wallet, title }: SendEntityRegistrationComponent) => {
	const { register } = useFormContext();
	const { entityRegistration } = useValidation();

	useEffect(() => {
		register("entityName", entityRegistration.entityName());
		register("ipfsData.meta.displayName", entityRegistration.displayName());
		register("ipfsData.meta.website", entityRegistration.website());
		register("ipfsData.meta.description", entityRegistration.description());

		register("ipfsData.sourceControl");
		register("ipfsData.socialMedia");
		register("ipfsData.images");
		register("ipfsData.videos");

		register("fees");
		register("fee");
	}, [register, entityRegistration]);

	return (
		<Tabs activeId={activeTab}>
			<TabPanel tabId={2}>
				<FormStep title={title} />
			</TabPanel>
			<TabPanel tabId={3}>
				<ReviewStep wallet={wallet} />
			</TabPanel>
		</Tabs>
	);
};

const transactionDetails = ({ transaction }: SendEntityRegistrationDetailsOptions) => (
	<SentStep transaction={transaction} />
);

FormStepsComponent.displayName = "EntityRegistrationForm";
transactionDetails.displayName = "EntityRegistrationFormTransactionDetails";

export const EntityRegistrationForm: SendEntityRegistrationForm = {
	tabSteps: 2,
	component: FormStepsComponent,
	transactionDetails,
	formFields: ["ipfsData", "entityName"],

	signTransaction: async ({ handleNext, form, setTransaction, profile, env, translations, type }) => {
		const { getValues, setValue, setError } = form;
		const { fee, entityName, ipfsData, mnemonic, senderAddress } = getValues();
		const senderWallet: ReadWriteWallet | undefined = profile.wallets().findByAddress(senderAddress);

		const sanitizedData = filter(ipfsData, (item) => !isEmpty(item));
		const entityType = type ?? Enums.EntityType.Business;

		try {
			const transactionId = await senderWallet!.transaction().signEntityRegistration({
				fee,
				from: senderAddress,
				sign: { mnemonic },
				data: {
					type: entityType,
					// @TODO: let the user choose what sub-type they wish to use.
					subType: Enums.EntitySubType.None,
					name: entityName,
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
			setError("mnemonic", { type: "manual", message: translations("TRANSACTION.INVALID_MNEMONIC") });
		}
	},
};
