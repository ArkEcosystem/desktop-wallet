import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, getDefaultProfileId, renderWithRouter, waitFor, within } from "utils/testing-library";

import { balances, portfolioPercentages, wallets } from "../../data";
import { Dashboard } from "./Dashboard";

const history = createMemoryHistory();
const fixtureProfileId = getDefaultProfileId();
const dashboardURL = `/profiles/${fixtureProfileId}/dashboard`;

describe("Dashboard", () => {
	beforeEach(() => {
		history.push(dashboardURL);
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.post("/api/transactions/search")
			.reply(200, require("tests/fixtures/coins/ark/transactions.json"))
			.persist();
	});

	afterEach(() => nock.cleanAll());

	it("should render", async () => {
		const { getAllByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("TransactionRow")).toHaveLength(2));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should hide transaction view", async () => {
		const { getByTestId, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard wallets={wallets} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("item-percentage")).toHaveLength(4));

		const filterNetwork = within(getByTestId("WalletControls")).getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(filterNetwork);
		});

		const toggle = getByTestId("filter-wallets_toggle--transactions");
		act(() => {
			fireEvent.click(toggle);
		});
	});

	it("should render portfolio percentage bar", async () => {
		const { getAllByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard portfolioPercentages={portfolioPercentages} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("item-percentage")).toHaveLength(4));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render portfolio chart", async () => {
		const { getAllByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} portfolioPercentages={portfolioPercentages} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("item-percentage")).toHaveLength(4));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should hide portfolio view", async () => {
		const { getByTestId, getAllByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} wallets={wallets} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("item-percentage")).toHaveLength(4));

		const filterNetwork = within(getByTestId("WalletControls")).getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(filterNetwork);
		});

		const toggle = getByTestId("filter-wallets_toggle--portfolio");
		act(() => {
			fireEvent.click(toggle);
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to import page", async () => {
		const { getByText, getAllByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("item-percentage")).toHaveLength(4));

		const importButton = getByText("Import");

		act(() => {
			fireEvent.click(importButton);
		});

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/wallets/import`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to create page", async () => {
		const { getByText, getAllByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} wallets={wallets} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("item-percentage")).toHaveLength(4));

		const createButton = getByText("Create");

		act(() => {
			fireEvent.click(createButton);
		});

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/wallets/create`);
		expect(asFragment()).toMatchSnapshot();
	});
});
