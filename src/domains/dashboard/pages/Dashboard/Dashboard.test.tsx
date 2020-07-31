import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import fixtureData from "tests/fixtures/env/storage.json";
import {
	act,
	env,
	fireEvent,
	getDefaultProfileId,
	renderWithRouter,
	useDefaultNetMocks,
	within,
} from "utils/testing-library";

import { balances, portfolioPercentages, transactions, wallets } from "../../data";
import { Dashboard } from "./Dashboard";

const history = createMemoryHistory();
const fixtureProfileId = getDefaultProfileId();
const dashboardURL = `/profiles/${fixtureProfileId}/dashboard`;

describe("Dashboard", () => {
	beforeAll(async () => {
		useDefaultNetMocks();

		await env.bootFromObject(fixtureData);
		await env.persist();

		history.push(dashboardURL);
	});

	it("should render", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should hide transaction view", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard wallets={wallets} transactions={transactions} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		const filterNetwork = within(getByTestId("WalletControls")).getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(filterNetwork);
		});

		const toggle = getByTestId("filter-wallets_toggle--transactions");
		act(() => {
			fireEvent.click(toggle);
		});
	});

	it("should render portfolio percentage bar", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard portfolioPercentages={portfolioPercentages} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render portfolio chart", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} portfolioPercentages={portfolioPercentages} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should hide portfolio view", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} wallets={wallets} transactions={transactions} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		const filterNetwork = within(getByTestId("WalletControls")).getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(filterNetwork);
		});

		const toggle = getByTestId("filter-wallets_toggle--portfolio");
		act(() => {
			fireEvent.click(toggle);
		});
	});

	it("should navigate to import page", () => {
		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);
		const importButton = getByText("Import");

		act(() => {
			fireEvent.click(importButton);
		});

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/wallets/import`);
	});

	it("should navigate to create page", () => {
		history.push(dashboardURL);

		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} wallets={wallets} transactions={transactions} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);
		const createButton = getByText("Create");

		act(() => {
			fireEvent.click(createButton);
		});

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/wallets/create`);
	});
});
