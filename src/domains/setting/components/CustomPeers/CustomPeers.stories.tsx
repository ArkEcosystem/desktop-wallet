import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { boolean } from "@storybook/addon-knobs";
import { httpClient } from "app/services";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { StubStorage } from "tests/mocks";

import { CustomPeers } from "./CustomPeers";

export default { title: "Domains / Setting / Components / CustomPeers" };

const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
const profile = env.profiles().create("Test profile");

export const Default = () => (
	<CustomPeers
		isOpen={boolean("Is Open", true)}
		networks={availableNetworksMock}
		profile={profile}
		onClose={() => alert("closed")}
		onAddPeer={() => alert("added peer")}
	/>
);
