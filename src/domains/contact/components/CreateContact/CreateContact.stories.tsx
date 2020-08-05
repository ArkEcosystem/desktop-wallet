import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { StubStorage } from "tests/mocks";

import { CreateContact } from "./CreateContact";

export default {
	title: "Domains / Contact / Components / CreateContact",
};

export const Default = () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	const profile = env.profiles().create("Test profile");

	return (
		<EnvironmentProvider env={env}>
			<CreateContact
				isOpen={true}
				profile={profile}
				networks={availableNetworksMock}
				onClose={() => alert("closed")}
				onCancel={() => alert("cancelled")}
				onSave={() => alert("saved")}
			/>
		</EnvironmentProvider>
	);
};
