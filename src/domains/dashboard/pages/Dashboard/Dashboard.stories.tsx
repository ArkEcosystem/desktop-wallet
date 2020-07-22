import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { StubStorage } from "tests/mocks";

import { balances, networks, portfolioPercentages, transactions } from "../../data";
import { Dashboard } from "./Dashboard";

export default { title: "Domains / Dashboard / Pages / Dashboard" };

const generateWallet = async (env: Environment, profile: Profile, count: Number = 1) => {
	const wallets = [];
	for (let index = 0; index < count; index++) {
		wallets.push(profile.wallets().generate("ARK", "mainnet"));
	}

	await Promise.all(wallets);

	await env?.persist();
};

export const Default = () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	const profile = env.profiles().create("John Doe");
	generateWallet(env, profile, 11);

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
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	const profile = env.profiles().create("John Doe");
	generateWallet(env, profile);

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
	return <Dashboard networks={networks} portfolioPercentages={portfolioPercentages} />;
};
