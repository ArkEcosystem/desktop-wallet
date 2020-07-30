import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, renderWithRouter } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

import { WalletCard } from "./WalletCard";

const dashboardURL = `/profiles/b999d134-7a24-481e-a95d-bc47c543bfc9/dashboard`;
const history = createMemoryHistory();
const fixtureWalletId = "ac38fe6d-4b67-4ef1-85be-17c5f6841129";
const fixtureWalletAddress = "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD";

describe("Wallet Card", () => {
	beforeAll(async () => {
		history.push(dashboardURL);

		await env.bootFromObject(fixtureData);
		await env.persist();
	});

	it("should render", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard id={fixtureWalletId} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render blank", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard isBlank />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with wallet data", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard
					id={fixtureWalletId}
					coinIcon="Ark"
					coinClass="border-theme-warning-200"
					walletName="My wallet"
					address={fixtureWalletAddress}
					balance="100,000 ARK"
				/>
				,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with wallet data and optional icon", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard
					id={fixtureWalletId}
					coinIcon="Ark"
					coinClass="border-theme-warning-200"
					walletName="My wallet"
					address={fixtureWalletAddress}
					balance="100,000 ARK"
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});
});
