import { Wallet, WalletFlag, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, renderWithRouter } from "testing-library";

import { WalletCard } from "./WalletCard";

const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
const history = createMemoryHistory();
let wallet: Wallet;

describe("Wallet Card", () => {
	beforeAll(() => {
		history.push(dashboardURL);
	});

	beforeEach(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		wallet.data().set(WalletFlag.Starred, true);
		wallet.data().set(WalletFlag.Ledger, true);
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
