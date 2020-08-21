import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { action } from "@storybook/addon-actions";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

import { SignIn } from "./SignIn";

export default {
	title: "Domains / Profile / Components / SignIn",
	decorators: [withKnobs],
};

export const Default = () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	const profile = env.profiles().create("Test profile");
	profile.auth().setPassword("password");

	return (
		<EnvironmentProvider env={env}>
			<SignIn
				isOpen={boolean("isOpen", true)}
				profile={profile}
				onCancel={action("onCancel")}
				onClose={action("onClose")}
				onSuccess={action("onSuccess")}
			/>
		</EnvironmentProvider>
	);
};
