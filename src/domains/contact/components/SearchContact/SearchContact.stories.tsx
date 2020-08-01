import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { action } from "@storybook/addon-actions";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

import { SearchContact } from "./SearchContact";

export default {
	title: "Domains / Contact / Pages / SearchContact",
	decorators: [withKnobs],
};

const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
const profile = env.profiles().create("Test profile");

export const Default = () => (
	<SearchContact
		isOpen={boolean("isOpen", true)}
		profile={profile}
		onClose={action("onClose")}
		onAction={console.log}
	/>
);

export const OneAction = () => (
	<SearchContact
		isOpen={boolean("isOpen", true)}
		profile={profile}
		onClose={action("onClose")}
		onAction={console.log}
		options={[{ value: "select", label: "Select" }]}
	/>
);
