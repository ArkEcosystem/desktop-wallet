import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import fixtureData from "tests/fixtures/env/storage-mainnet.json";
import { mockArkHttp, StubStorage } from "tests/mocks";
import { act, fireEvent, renderWithRouter } from "utils/testing-library";

import { networks } from "../../data";
import { Wallets } from "./Wallets";

const history = createMemoryHistory();
let dashboardURL: string;
let profile: Profile;
let wallet: Wallet;

beforeAll(() => {
	mockArkHttp();
});

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
	beforeEach(async () => {
		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		profile = env.profiles().all()[0];
		wallet = profile.wallets().values()[0];

		dashboardURL = `/profiles/${profile.id()}/dashboard`;
		history.push(dashboardURL);
	});

	it("should render grid", () => {
		const { container, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={[wallet]} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getAllByTestId("WalletCard__blank")).toBeTruthy();
		expect(container).toBeTruthy();
	});

	it("should render many wallets on grid", () => {
		const { container, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={new Array(10).fill(wallet)} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(() => getAllByTestId("WalletCard__blank")).toThrow(/^Unable to find an element by/);
		expect(container).toBeTruthy();
	});

	it("should render list", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={[wallet]} viewType="list" filterProperties={filterProperties} />
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
				<Wallets viewType="list" wallets={[wallet]} filterProperties={filterProperties} />
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
				<Wallets viewType="list" wallets={[wallet]} filterProperties={filterProperties} />
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
