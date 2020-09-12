import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, within } from "testing-library";

import { WalletBottomSheetMenu } from "./WalletBottomSheetMenu";

const history = createMemoryHistory();

let profile: Profile;
let wallets: ReadWriteWallet[];

let walletURL: string;

let bip39GenerateMock: any;

const passphrase = "power return attend drink piece found tragic fire liar page disease combine";

beforeAll(() => {
	bip39GenerateMock = jest.spyOn(BIP39, "generate").mockReturnValue(passphrase);
});

afterAll(() => {
	bip39GenerateMock.mockRestore();
});

describe("WalletBottomSheetMenu", () => {
	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallets = profile.wallets().values();

		walletURL = `/profiles/${profile.id()}/wallets/${wallets[0].id()}`;
		history.push(walletURL);
	});

	it("should render", () => {
		const { getByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletBottomSheetMenu wallets={wallets} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByTestId("WalletBottomSheetMenu")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show counter", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletBottomSheetMenu wallets={wallets} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByTestId("WalletBottomSheetMenu__counter")).toHaveTextContent(wallets.length.toString());
	});

	it("should be open", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletBottomSheetMenu wallets={wallets} defaultIsOpen={true} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "false");
	});

	it("should toggle", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletBottomSheetMenu wallets={wallets} defaultIsOpen={true} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		act(() => {
			fireEvent.click(getByTestId("WalletBottomSheetMenu__toggle"));
		});

		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});

	it("should not close when clicking on active wallet", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletBottomSheetMenu wallets={wallets} defaultIsOpen={true} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		act(() => {
			fireEvent.click(within(getByTestId("WalletTable")).getByText(wallets[0].alias()));
		});

		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "false");
	});

	it("should redirect when clicking on other wallet", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletBottomSheetMenu wallets={wallets} defaultIsOpen={true} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		act(() => {
			fireEvent.click(within(getByTestId("WalletTable")).getByText(wallets[1].alias()));
		});

		expect(history.location.pathname).toMatch(`/profiles/${profile.id()}/wallets/${wallets[1].id()}`);
	});
});
