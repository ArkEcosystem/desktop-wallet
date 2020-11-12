import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { StubStorage } from "tests/mocks";

import { PeerTable } from "./PeerTable";

export default { title: "Domains / Setting / Components / PeerTable" };

const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
const profile = env.profiles().create("Test profile");

export const Default = () => (
	<EnvironmentProvider env={env}>
		<PeerTable networks={availableNetworksMock} profile={profile} />
	</EnvironmentProvider>
);
