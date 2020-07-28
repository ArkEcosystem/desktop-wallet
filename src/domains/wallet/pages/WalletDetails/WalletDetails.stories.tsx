import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

import { wallet, wallets } from "../../data";
import { WalletDetails } from "./WalletDetails";

export default { title: "Domains / Wallet / Pages / WalletDetails" };

export const Default = () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	return (
		<EnvironmentProvider env={env}>
			<WalletDetails wallets={[wallets[0]]} wallet={wallet} />
		</EnvironmentProvider>
	);
};

export const MultipleWallets = () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	return (
		<EnvironmentProvider env={env}>
			<WalletDetails wallets={wallets} wallet={wallet} />
		</EnvironmentProvider>
	);
};
