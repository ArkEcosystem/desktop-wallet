import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { action } from "@storybook/addon-actions";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

import { SearchRecipient } from "./SearchRecipient";

export default {
	title: "Domains / Contact / Pages / SearchRecipient",
	decorators: [withKnobs],
};

const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
const profile = env.profiles().create("Test profile");

export const Default = () => (
	<SearchRecipient
		isOpen={boolean("isOpen", true)}
		profile={profile}
		onClose={action("onClose")}
		onAction={console.log}
	/>
);

export const OneAction = () => (
	<SearchRecipient
		isOpen={boolean("isOpen", true)}
		profile={profile}
		onClose={action("onClose")}
		onAction={console.log}
	/>
);
