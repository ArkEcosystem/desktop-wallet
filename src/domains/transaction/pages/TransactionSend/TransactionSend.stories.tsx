import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { availableNetworksMock } from "domains/network/data";
import { wallets } from "domains/wallet/data";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { StubStorage } from "tests/mocks";

import { TransactionSend } from "./TransactionSend";

export default { title: "Domains / Transaction / Pages / Transaction Send" };

export const Default = () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	const profile = env.profiles().create("Test profile");
	profile.contacts().create("Test contact");

	const defaultFormValues = {
		maxAvailableAmount: 80,
		assetSymbol: "ARK",
		feeRange: {
			last: 10,
			min: 1,
			average: 14,
		},
		networks: availableNetworksMock,
		defaultFee: 0,
		formDefaultData: {
			network: null,
			sender: null,
			amount: null,
			smartbridge: null,
			fee: 0,
		},
		profile,
		wallets,
	};

	return (
		<EnvironmentProvider env={env}>
			<MemoryRouter initialEntries={[`/profiles/${profile.id()}/transactions/transfer`]}>
				<Route
					component={() => <TransactionSend formValues={defaultFormValues} />}
					path="/profiles/:profileId/transactions/transfer"
				/>
			</MemoryRouter>
		</EnvironmentProvider>
	);
};
