import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

import { AddRecipient } from "./AddRecipient";

export default {
	title: "Domains / Transaction / Components / AddRecipient",
};

const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
const profile = env.profiles().create("Test profile");

export const Default = () => (
	<div className="p-8">
		<AddRecipient assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} profile={profile} />
	</div>
);
