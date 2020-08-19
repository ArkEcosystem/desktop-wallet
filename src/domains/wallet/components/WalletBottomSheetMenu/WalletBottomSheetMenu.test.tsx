import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter } from "testing-library";

import { WalletBottomSheetMenu } from "./WalletBottomSheetMenu";

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;

let data: any;
let bip39GenerateMock: any;

const passphrase = "power return attend drink piece found tragic fire liar page disease combine";

beforeAll(() => {
	history.push(dashboardURL);

	bip39GenerateMock = jest.spyOn(BIP39, "generate").mockReturnValue(passphrase);
});

afterAll(() => {
	bip39GenerateMock.mockRestore();
});

describe("WalletBottomSheetMenu", () => {
	beforeEach(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		data = [
			{
				coinClassName: "text-theme-danger-400 border-theme-danger-light",
				wallet,
			},
		];
	});

	it("should render", () => {
		const { getByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletBottomSheetMenu walletsData={data} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByTestId("WalletBottomSheetMenu")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show counter", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletBottomSheetMenu walletsData={data} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByTestId("WalletBottomSheetMenu__counter")).toHaveTextContent(data.length.toString());
	});

	it("should be open", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletBottomSheetMenu walletsData={data} defaultIsOpen={true} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "false");
	});

	it("should toggle", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<WalletBottomSheetMenu walletsData={data} defaultIsOpen={true} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		act(() => {
			fireEvent.click(getByTestId("WalletBottomSheetMenu__toggle"));
		});

		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});
});
