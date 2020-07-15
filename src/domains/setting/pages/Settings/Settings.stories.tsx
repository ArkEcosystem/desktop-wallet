import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

import { Settings } from "./Settings";

export default { title: "Domains / Setting / Pages / Settings" };

export const GeneralSettings = () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

	return (
		<EnvironmentProvider env={env}>
			<div className="w-full h-full">
				<Settings />
			</div>
		</EnvironmentProvider>
	);
};
