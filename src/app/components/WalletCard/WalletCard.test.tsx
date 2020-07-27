import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Wallet, WalletFlag,WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { renderWithRouter } from "testing-library";
import fixtureData from "tests/fixtures/env/storage-mainnet.json";
import { mockArkHttp, StubStorage } from "tests/mocks";

import { WalletCard } from "./WalletCard";

const history = createMemoryHistory();
let dashboardURL: string;
let wallet: Wallet;

beforeAll(() => {
	mockArkHttp();
});

describe("WalletCard", () => {
	beforeEach(async () => {
		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		const profile = env.profiles().all()[0];
		wallet = profile.wallets().values()[0];
		wallet.data().set(WalletFlag.Starred, true);
		wallet.data().set(WalletFlag.Ledger, true);

		dashboardURL = `/profiles/${profile.id()}/dashboard`;
		history.push(dashboardURL);
	});

	it("should render", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard wallet={wallet} />
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
				<WalletCard isBlank wallet={wallet} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with wallet data", () => {
		wallet.settings().set(WalletSetting.Alias, "My wallet");

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard coinClass="border-theme-warning-200" wallet={wallet} />,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with wallet data and optional icon", () => {
		wallet.settings().set(WalletSetting.Alias, "My wallet");

		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletCard coinClass="border-theme-warning-200" wallet={wallet} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});
});
