import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { StubStorage } from "tests/mocks";

import { UpdateContact } from "./UpdateContact";

export default {
	title: "Domains / Contact / Components / UpdateContact",
};

export const Default = () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	const profile = env.profiles().create("Test profile");
	const contact = profile.contacts().create("Test contact");

	return (
		<EnvironmentProvider env={env}>
			<UpdateContact
				profile={profile}
				isOpen={true}
				networks={availableNetworksMock}
				contact={contact}
				onClose={() => alert("closed")}
				onCancel={() => alert("cancelled")}
				onDelete={() => alert("deleted")}
				onSave={console.log}
			/>
		</EnvironmentProvider>
	);
};
