import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { StubStorage } from "tests/mocks";

import { ImportWallet } from "./ImportWallet";

const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
const profile = env.profiles().create("John Doe");

export default { title: "Domains / Wallet / Pages / ImportWallet" };

export const Default = () => (
	<EnvironmentProvider env={env}>
		<MemoryRouter initialEntries={[`/profiles/${profile.id()}/wallets/import`]}>
			<Route component={(routerProps: any) => <ImportWallet />} path="/profiles/:profileId/wallets/import" />
		</MemoryRouter>
	</EnvironmentProvider>
);
