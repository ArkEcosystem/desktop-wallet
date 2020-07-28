import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { boolean, text, withKnobs } from "@storybook/addon-knobs";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

import { SignMessage } from "./SignMessage";

const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
const profile = env.profiles().create("Anne Doe");

export default { title: "Domains / Wallet / Components / Sign Message", decorators: [withKnobs] };

export const Default = () => {
	const signatoryAddress = text("Address", "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT");
	const isOpen = boolean("Is Open?", true);

	return (
		<EnvironmentProvider env={env}>
			<SignMessage
				profileId={profile.id()}
				walletId={"123"}
				signatoryAddress={signatoryAddress}
				isOpen={isOpen}
				onClose={() => alert("Close action")}
				onCancel={() => alert("Cancel action")}
			/>
		</EnvironmentProvider>
	);
};
