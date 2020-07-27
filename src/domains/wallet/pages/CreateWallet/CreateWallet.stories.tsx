import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { StubStorage } from "tests/mocks";

import { CreateWallet } from "./CreateWallet";

export default { title: "Domains / Wallet / Pages / CreateWallet" };

export const Default = () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	const profile = env.profiles().create("Anne Doe");

	return (
		<EnvironmentProvider env={env}>
			<MemoryRouter initialEntries={[`/profiles/${profile.id()}/wallets/create`]}>
				<Route component={() => <CreateWallet />} path="/profiles/:profileId/wallets/create" />
			</MemoryRouter>
		</EnvironmentProvider>
	);
};
