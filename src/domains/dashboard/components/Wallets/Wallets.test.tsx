import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import fixtureData from "tests/fixtures/env/storage.json";
import { act, env, fireEvent, renderWithRouter } from "utils/testing-library";

import { networks, wallets } from "../../data";
import { Wallets } from "./Wallets";

const history = createMemoryHistory();

const dashboardURL = `/profiles/b999d134-7a24-481e-a95d-bc47c543bfc9/dashboard`;

// Wallet filter properties
const filterProperties = {
	visibleTransactionsView: true,
	visiblePortfolioView: true,
	networks,
	onNetworkChange: (changedNetwork: any, newNetworksList: any) => {
		console.log("changed network", changedNetwork);
		console.log("changed network new list", newNetworksList);
	},
	togglePortfolioView: (isChecked: boolean) => {
		console.log("show portfolio view", isChecked);
	},
	toggleTransactionsView: (isChecked: boolean) => {
		console.log("show transactions view", isChecked);
	},
	onWalletsDisplay: () => {
		alert("on Wallet display");
	},
	onViewAllNetworks: () => {
		alert("on view all networks");
	},
};

describe("Wallets", () => {
	beforeAll(async () => {
		await env.bootFromObject(fixtureData);
		await env.persist();
		history.push(dashboardURL);
	});

	it("should render", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={wallets} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toBeTruthy();
	});

	it("should render with empty wallets list", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={[]} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with list view enabled as default", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets viewType="list" wallets={wallets} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with list view enabled as default and empty wallet list", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets viewType="list" wallets={wallets} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should change wallet view type from list to grid", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets viewType="list" wallets={[]} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);
		const toggle = getByTestId("LayoutControls__grid--icon");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(toggle).toHaveClass("text-theme-danger-300");
	});

	it("should change wallet view type from grid to list", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets viewType="grid" wallets={[]} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);
		const toggle = getByTestId("LayoutControls__list--icon");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(toggle).toHaveClass("text-theme-danger-300");
	});
});
