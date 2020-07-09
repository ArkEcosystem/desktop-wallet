import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { renderWithRouter } from "testing-library";
import { StubStorage } from "tests/mocks";

import { WalletCard } from "./WalletCard";

describe("Formatted Address", () => {
	const history = createMemoryHistory();
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	const profile = env.profiles().create("Jane Doe");

	const dashboardURL = `/profiles/${profile.id()}/dashboard`;
	history.push(dashboardURL);

	it("should render", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<WalletCard id="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render blank", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<WalletCard isBlank id="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with wallet data", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<WalletCard
						id="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
						coinIcon="Bitcoin"
						coinClass="border-theme-warning-200"
						avatarId="test"
						walletName="My wallet"
						address="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
						balance="100,000 BTC"
					/>
					,
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with wallet data and optional icon", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<WalletCard
						id="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
						coinIcon="Bitcoin"
						coinClass="border-theme-warning-200"
						avatarId="test"
						walletName="My wallet"
						address="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
						balance="100,000 BTC"
					/>
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});
});
