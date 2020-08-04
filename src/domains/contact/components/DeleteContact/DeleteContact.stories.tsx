import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

import { DeleteContact } from "./DeleteContact";

export default {
	title: "Domains / Contact / Components / DeleteContact",
	decorators: [withKnobs],
};

export const Default = () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	const profile = env.profiles().create("Test profile");
	const contact = profile.contacts().create("Test contact");

	return (
		<EnvironmentProvider env={env}>
			<DeleteContact
				contact={contact}
				profile={profile}
				isOpen={boolean("isOpen", true)}
				onClose={() => alert("closed")}
				onCancel={() => alert("cancelled")}
				onDelete={() => alert("deleted")}
			/>
		</EnvironmentProvider>
	);
};
