import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, render, renderWithRouter, waitFor } from "utils/testing-library";

import { GridWallet, WalletsGrid } from "./";

let profile: Profile;
let wallets: GridWallet[];

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;

describe("WalletsGrid", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());

		wallets = profile
			.wallets()
			.values()
			.map((wallet) => ({ wallet: wallet, actions: [] }));
	});

	beforeEach(() => {
		history.push(dashboardURL);
	});

	it("should not render if visible prop is falsy", () => {
		const { getByTestId } = render(<WalletsGrid wallets={[]} isVisible={false} />);

		expect(() => getByTestId("WalletsGrid")).toThrow();
	});

	it("should render loading state", async () => {
		const { getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletsGrid wallets={wallets} isVisible={true} isLoading={true} />,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("WalletCard__skeleton").length).toBeGreaterThan(2));
	});

	it("should render wallets", async () => {
		const { getByTestId, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletsGrid wallets={wallets} isVisible={true} />,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByTestId("WalletsGrid")).toBeTruthy();
		await waitFor(() => expect(getAllByTestId("Card").length).toBe(2));
	});
});
