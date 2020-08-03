import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor, within } from "utils/testing-library";

import { balances, portfolioPercentages, transactions } from "../../data";
import { Dashboard } from "./Dashboard";

const history = createMemoryHistory();
let emptyProfile: Profile;

const fixtureProfileId = getDefaultProfileId();
let dashboardURL: string;

describe("Dashboard", () => {
	beforeEach(() => {
		emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		dashboardURL = `/profiles/${fixtureProfileId}/dashboard`;
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
		dashboardURL = `/profiles/${emptyProfile.id()}/dashboard`;
		history.push(dashboardURL);

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
		const { asFragment, getByTestId } = renderWithRouter(
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

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/wallets/import`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to create page", () => {
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

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/wallets/create`);
		expect(asFragment()).toMatchSnapshot();
	});
});
