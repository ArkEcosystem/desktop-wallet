import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, render, renderWithRouter } from "utils/testing-library";

import { translations } from "../../i18n";
import { GridWallet, WalletsList } from ".";

const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
const history = createMemoryHistory();

let profile: Contracts.IProfile;
let wallets: GridWallet[];

describe("WalletsList", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());

		wallets = profile
			.wallets()
			.values()
			.map((wallet) => ({ actions: [], wallet: wallet }));

		history.push(dashboardURL);
	});

	it("should render", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletsList wallets={wallets} />
			</Route>,
			{
				history,
				routes: [dashboardURL],
			},
		);

		expect(getByTestId("WalletsList")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render if isVisible is false", () => {
		const { asFragment, getByTestId } = render(<WalletsList wallets={wallets} isVisible={false} />);

		expect(() => getByTestId("WalletsList")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with view more button", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletsList wallets={wallets} hasMore={true} />
			</Route>,
			{
				history,
				routes: [dashboardURL],
			},
		);

		expect(getByTestId("WalletsList")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render empty block", () => {
		const { asFragment, getByTestId } = render(<WalletsList wallets={[]} />);

		expect(getByTestId("EmptyBlock")).toBeTruthy();
		expect(getByTestId("EmptyBlock")).toHaveTextContent(translations.WALLET_CONTROLS.EMPTY_MESSAGE);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render empty block for starred display type", () => {
		const { asFragment, getByTestId } = render(<WalletsList wallets={[]} walletsDisplayType="starred" />);

		expect(getByTestId("EmptyBlock")).toBeTruthy();
		expect(getByTestId("EmptyBlock")).toHaveTextContent(
			translations.WALLET_CONTROLS.EMPTY_MESSAGE_TYPE.replace("<bold>{{type}}</bold>", "Starred"),
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render empty block for ledger display type", () => {
		const { asFragment, getByTestId } = render(<WalletsList wallets={[]} walletsDisplayType="ledger" />);

		expect(getByTestId("EmptyBlock")).toBeTruthy();
		expect(getByTestId("EmptyBlock")).toHaveTextContent(
			translations.WALLET_CONTROLS.EMPTY_MESSAGE_TYPE.replace("<bold>{{type}}</bold>", "Ledger"),
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render loading state", () => {
		const { asFragment, getAllByTestId } = render(<WalletsList wallets={[]} isLoading={true} />);

		expect(getAllByTestId("TableRow").length).toBeGreaterThan(0);
		expect(asFragment()).toMatchSnapshot();
	});
});
