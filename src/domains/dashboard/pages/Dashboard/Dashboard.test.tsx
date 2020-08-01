import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, getDefaultProfileId, renderWithRouter, within, waitFor } from "utils/testing-library";

import { balances, portfolioPercentages, wallets } from "../../data";
import { Dashboard } from "./Dashboard";

const history = createMemoryHistory();
const fixtureProfileId = getDefaultProfileId();
const dashboardURL = `/profiles/${fixtureProfileId}/dashboard`;

describe("Dashboard", () => {
	beforeAll(() => {
		history.push(dashboardURL);
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.post("/api/transactions/search")
			.reply(200, require("tests/fixtures/coins/ark/transactions.json"))
			.persist();
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

		waitFor(() => expect(container).toMatchSnapshot());
	});

	it("should hide transaction view", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard wallets={wallets} />
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

		waitFor(() => expect(container).toMatchSnapshot());
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

		waitFor(() => expect(container).toMatchSnapshot());
	});

	it("should hide portfolio view", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} wallets={wallets} />
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

		waitFor(() => expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/wallets/import`));
	});

	it("should navigate to create page", () => {
		history.push(dashboardURL);

		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} wallets={wallets} />
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

		waitFor(() => expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/wallets/create`));
	});
});
