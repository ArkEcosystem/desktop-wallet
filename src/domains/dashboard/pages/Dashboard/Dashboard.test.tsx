import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile, Wallet, WalletFlag } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import fixtureData from "tests/fixtures/env/storage-mainnet.json";
import { mockArkHttp, StubStorage } from "tests/mocks";
import { act, fireEvent, renderWithRouter, waitFor, within } from "utils/testing-library";

import { balances, portfolioPercentages, transactions } from "../../data";
import { Dashboard } from "./Dashboard";

const history = createMemoryHistory();
let dashboardURL: string;
let profile: Profile;
let wallet: Wallet;

beforeAll(() => {
	mockArkHttp();
});

describe("Dashboard", () => {
	beforeEach(async () => {
		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		profile = env.profiles().all()[0];
		wallet = profile.wallets().values()[0];
		wallet.data().set(WalletFlag.Starred, true);
		wallet.data().set(WalletFlag.Ledger, true);

		dashboardURL = `/profiles/${profile.id()}/dashboard`;
		history.push(dashboardURL);
	});

	it("should render", () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render wallets", async () => {
		Promise.resolve().then(() => jest.useFakeTimers());

		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		Promise.resolve().then(() => jest.advanceTimersByTime(1000));

		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render with no wallets", async () => {
		profile.wallets().forget(wallet.id());

		Promise.resolve().then(() => jest.useFakeTimers());

		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		Promise.resolve().then(() => jest.advanceTimersByTime(1000));

		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should hide transaction view", () => {
		const { asFragment, getByTestId, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard transactions={transactions} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		fireEvent.click(within(getByTestId("WalletControls")).getByTestId("dropdown__toggle"));
		fireEvent.click(getByTestId("filter-wallets_toggle--transactions"));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render portfolio percentage bar", () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard portfolioPercentages={portfolioPercentages} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render portfolio chart", () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} portfolioPercentages={portfolioPercentages} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should hide portfolio view", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} transactions={transactions} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		fireEvent.click(within(getByTestId("WalletControls")).getByTestId("dropdown__toggle"));

		const toggle = getByTestId("filter-wallets_toggle--portfolio");
		act(() => {
			fireEvent.click(toggle);
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to import page", () => {
		const { asFragment, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		fireEvent.click(getByText("Import"));

		expect(history.location.pathname).toEqual(`/profiles/${profile.id()}/wallets/import`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to create page", () => {
		history.push(dashboardURL);

		const { asFragment, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} transactions={transactions} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		fireEvent.click(getByText("Create"));

		expect(history.location.pathname).toEqual(`/profiles/${profile.id()}/wallets/create`);
		expect(asFragment()).toMatchSnapshot();
	});
});
