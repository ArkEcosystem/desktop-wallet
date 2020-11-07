import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, within } from "utils/testing-library";

import { networks } from "../../data";
import { Wallets } from "./Wallets";

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;

let profile: Profile;
let wallets: ReadWriteWallet[];

// Wallet filter properties
const filterProperties = {
	networks,
	selectedNetworkIds: ["ark.devnet", "eth.mainnet", "btc.mainnet"],
	visibleTransactionsView: true,
	visiblePortfolioView: true,
	walletsDisplayType: "all",
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
	onViewAllNetworks: () => {
		alert("on view all networks");
	},
	onWalletsDisplayType: () => {
		alert("on wallets display");
	},
};

describe("Wallets", () => {
	beforeEach(() => {
		history.push(dashboardURL);

		profile = env.profiles().findById(getDefaultProfileId());
		wallets = profile.wallets().values();
	});

	it("should render grid", () => {
		const { asFragment, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={wallets} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getAllByTestId("WalletCard__blank")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it.each(["all", "favorites", "ledger"])("should render wallets type in a grid view", (type) => {
		const { asFragment, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets
					wallets={wallets}
					filterProperties={{
						...filterProperties,
						walletsDisplayType: type,
					}}
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getAllByTestId("WalletCard__blank")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render one grid row when less than three wallets", () => {
		const { asFragment, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={new Array(1).fill(wallets[0])} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getAllByTestId("WalletCard__blank")).toHaveLength(2);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render two grid rows when more than three wallets", () => {
		const { asFragment, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={new Array(5).fill(wallets[0])} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getAllByTestId("WalletCard__blank")).toHaveLength(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render list", () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={wallets} viewType="list" filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it.each(["all", "favorites", "ledger"])("should render wallets type in a list view", (type) => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets
					wallets={wallets}
					viewType="list"
					filterProperties={{
						...filterProperties,
						walletsDisplayType: type,
					}}
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should redirect when clicking on row", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={wallets} viewType="list" filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		act(() => {
			fireEvent.click(within(getByTestId("WalletTable")).getByText(wallets[0].alias()!));
		});

		expect(history.location.pathname).toMatch(`/profiles/${profile.id()}/wallets/${wallets[0].id()}`);
	});

	it("should render with empty wallets list", () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={[]} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with list view enabled as default", () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets viewType="list" wallets={wallets} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with list view enabled as default and empty wallet list", () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets viewType="list" wallets={wallets} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should change wallet view type from list to grid", () => {
		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets viewType="list" wallets={wallets} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		const toggle = getByTestId("LayoutControls__grid--icon");

		expect(() => getAllByTestId("Card")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getAllByTestId("Card")).toHaveLength(3);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should change wallet view type from grid to list", () => {
		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets viewType="grid" wallets={[]} filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		const toggle = getByTestId("LayoutControls__list--icon");

		expect(getAllByTestId("Card")).toHaveLength(3);

		act(() => {
			fireEvent.click(toggle);
		});

		expect(() => getAllByTestId("Card")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should hide the view more button if there are less than 10 wallets", () => {
		const { asFragment, queryByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={new Array(9).fill(wallets[0])} viewType="list" filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(queryByTestId("Wallets__ViewMore")).toBeFalsy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show the view more button if there are more than 10 wallets", () => {
		const { asFragment, queryByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={new Array(11).fill(wallets[0])} viewType="list" filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(queryByTestId("WalletsList__ViewMore")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should load more wallets", () => {
		const lastWallet = profile.wallets().findById("d044a552-7a49-411c-ae16-8ff407acc430");

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets
					wallets={[...new Array(10).fill(wallets[0]), lastWallet]}
					viewType="list"
					filterProperties={filterProperties}
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(container.innerHTML).not.toContain(lastWallet.address());

		act(() => {
			fireEvent.click(getByTestId("WalletsList__ViewMore"));
		});

		expect(container.innerHTML).toContain(lastWallet.address());
	});
});
