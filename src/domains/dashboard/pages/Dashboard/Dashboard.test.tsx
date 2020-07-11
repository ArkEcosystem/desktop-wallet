import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, renderWithRouter, within } from "testing-library";
import { StubStorage } from "tests/mocks";

import { balances, portfolioPercentages, transactions, wallets } from "../../data";
import { Dashboard } from "./Dashboard";

describe("Dashboard", () => {
	const history = createMemoryHistory();
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

	const dashboardURL = `/profiles/qwe123/dashboard`;
	history.push(dashboardURL);

	it("should render", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<Dashboard />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should hide transaction view", () => {
		const { getByTestId } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<Dashboard wallets={wallets} transactions={transactions} />
				</Route>
			</EnvironmentContext.Provider>,
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
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<Dashboard portfolioPercentages={portfolioPercentages} />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render portfolio chart", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<Dashboard balances={balances} portfolioPercentages={portfolioPercentages} />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should hide portfolio view", () => {
		const { getByTestId } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<Dashboard balances={balances} wallets={wallets} transactions={transactions} />
				</Route>
			</EnvironmentContext.Provider>,
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
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<Dashboard />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);
		const importButton = getByText("Import");

		act(() => {
			fireEvent.click(importButton);
		});

		expect(history.location.pathname).toEqual(`/profiles/qwe123/wallets/import`);
	});

	it("should navigate to create page", () => {
		history.push(dashboardURL);

		const { getByText } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/dashboard">
					<Dashboard balances={balances} wallets={wallets} transactions={transactions} />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [dashboardURL],
				history,
			},
		);
		const createButton = getByText("Create");

		act(() => {
			fireEvent.click(createButton);
		});

		expect(history.location.pathname).toEqual(`/profiles/qwe123/wallets/create`);
	});
});
