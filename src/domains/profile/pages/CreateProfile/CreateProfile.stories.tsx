import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

import { CreateProfile } from "./CreateProfile";

export default {
	title: "Domains / Profile / Pages / CreateProfile",
};

export const Default = () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

	return (
		<EnvironmentProvider env={env}>
			<div className="w-full h-full">
				<CreateProfile onSubmit={() => void 0} />
			</div>
		</EnvironmentProvider>
	);
};
