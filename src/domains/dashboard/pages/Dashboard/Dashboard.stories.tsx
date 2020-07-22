import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { StubStorage } from "tests/mocks";

import { balances, networks, portfolioPercentages, transactions } from "../../data";
import { Dashboard } from "./Dashboard";

export default { title: "Domains / Dashboard / Pages / Dashboard" };

const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
const profile = env.profiles().create("John Doe");

export const Default = () => {
	return (
		<EnvironmentProvider env={env}>
			<MemoryRouter initialEntries={[`/profiles/${profile.id()}/dashboard`]}>
				<Route
					path="/profiles/:profileId/dashboard"
					component={() => (
						<Dashboard
							balances={balances}
							networks={networks}
							transactions={transactions}
							portfolioPercentages={portfolioPercentages}
						/>
					)}
				/>
			</MemoryRouter>
		</EnvironmentProvider>
	);
};

export const FewerWallets = () => {
	profile
		.wallets()
		.generate("ARK", "mainnet")
		.then(() => {
			console.log("generate wallet", profile.wallets().all());
		})
		.catch((e) => {
			console.log("generate wallet error", e);
		});

	return (
		<EnvironmentProvider env={env}>
			<MemoryRouter initialEntries={[`/profiles/${profile.id()}/dashboard`]}>
				<Route
					path="/profiles/:profileId/dashboard"
					component={() => (
						<Dashboard
							balances={balances}
							networks={networks}
							transactions={transactions}
							portfolioPercentages={portfolioPercentages}
						/>
					)}
				/>
			</MemoryRouter>
		</EnvironmentProvider>
	);
};

export const Empty = () => {
	return <Dashboard wallets={[]} networks={networks} portfolioPercentages={portfolioPercentages} />;
};
