import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter } from "utils/testing-library";

import { networks } from "../../data";
import { Wallets } from "./Wallets";

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;

let profile: Profile;
let wallet: ReadWriteWallet;

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
	beforeAll(() => {
		history.push(dashboardURL);
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
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

	it("should redirect when clicking on row", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets wallets={[wallet]} viewType="list" filterProperties={filterProperties} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		act(() => {
			fireEvent.click(getByTestId(`WalletListItem__${wallet.address()}`));
		});

		expect(history.location.pathname).toMatch(`/profiles/${profile.id()}/wallets/${wallet.id()}`);
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

	it("should hide the view more button if there are less than 10 wallets", () => {
		const { queryByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets
					wallets={[wallet, wallet, wallet, wallet, wallet, wallet, wallet, wallet, wallet, wallet]}
					viewType="list"
					filterProperties={filterProperties}
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(queryByTestId("Wallets__ViewMore")).toBeFalsy();
	});

	it("should show the view more button if there are more than 10 wallets", () => {
		const { queryByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets
					wallets={[wallet, wallet, wallet, wallet, wallet, wallet, wallet, wallet, wallet, wallet, wallet]}
					viewType="list"
					filterProperties={filterProperties}
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(queryByTestId("WalletsList__ViewMore")).toBeTruthy();
	});

	it("should click view", () => {
		const lastWallet = profile.wallets().findById("d044a552-7a49-411c-ae16-8ff407acc430");

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets
					wallets={[
						wallet,
						wallet,
						wallet,
						wallet,
						wallet,
						wallet,
						wallet,
						wallet,
						wallet,
						wallet,
						lastWallet,
					]}
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
