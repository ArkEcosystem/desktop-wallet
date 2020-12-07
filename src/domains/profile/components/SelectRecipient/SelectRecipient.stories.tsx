import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

import { SelectRecipient } from "./SelectRecipient";

export default { title: "Domains / Profile / Components / Select Recipient" };

const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
const profile = env.profiles().create("Test profile");

export const Default = () => (
	<div className="space-y-8 max-w-lg">
		<div>
			<SelectRecipient profile={profile} />
		</div>
		<div>
			<SelectRecipient profile={profile} isInvalid />
		</div>
		<div>
			<SelectRecipient profile={profile} disabled />
		</div>
		<div>
			<div className="mb-3">Selected address</div>
			<SelectRecipient profile={profile} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />
		</div>
		<div>
			<div className="mb-3">Selected address (disabled)</div>
			<SelectRecipient profile={profile} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" disabled />
		</div>
	</div>
);
