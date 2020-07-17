import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

import { networks } from "../../data";
import { ImportWallet } from "./ImportWallet";

export default {
	title: "Domains / Wallet / Pages / ImportWallet",
};

export const Default = () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

	return (
		<EnvironmentProvider env={env}>
			<div className="w-full h-full">
				<ImportWallet networks={networks} />
			</div>
		</EnvironmentProvider>
	);
};
