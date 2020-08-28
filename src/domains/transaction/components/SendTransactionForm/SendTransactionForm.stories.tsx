import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import { availableNetworksMock } from "domains/network/data";
import { wallets } from "domains/wallet/data";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StubStorage } from "tests/mocks";

import { SendTransactionForm } from "./SendTransactionForm";

export default {
	title: "Domains / Transaction / Components / SendTransactionForm",
};

const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
const profile = env.profiles().create("Test profile");

const defaultFormValues = {
	maxAvailableAmount: 80,
	assetSymbol: "ARK",
	feeRange: {
		last: 10,
		min: 1,
		average: 14,
	},
	defaultFee: 0,
	formDefaultData: {
		network: null,
		sender: null,
		amount: null,
		smartbridge: null,
		fee: 0,
	},
	networks: availableNetworksMock,
	profile,
	wallets,
};

export const Default = () => {
	const form = useForm();

	return (
		<div className="container mx-auto">
			<FormProvider {...form}>
				<SendTransactionForm {...defaultFormValues} />
			</FormProvider>
		</div>
	);
};
