import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

import { Input, InputAddress, InputCounter, InputPassword } from "./index";

const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

export default {
	title: "App / Components / Input",
};

export const Default = () => (
	<div className="space-y-4 max-w-xs">
		<Input type="text" placeholder="Enabled" />
		<Input type="text" placeholder="Invalid" aria-invalid={true} />
		<Input type="text" placeholder="Disabled" disabled />
	</div>
);

export const Address = () => (
	<EnvironmentProvider env={env}>
		<div className="max-w-xs">
			<InputAddress coin="ARK" network="ark.devnet" defaultValue="DT11QcbKqTXJ59jrUTpcMyggTcwmyFYRTM" />
		</div>
	</EnvironmentProvider>
);

export const Counter = () => (
	<div className="max-w-xs">
		<InputCounter defaultValue="Hello" maxLength={255} />
	</div>
);

export const Password = () => (
	<div className="max-w-xs">
		<InputPassword defaultValue="secret" />
	</div>
);
