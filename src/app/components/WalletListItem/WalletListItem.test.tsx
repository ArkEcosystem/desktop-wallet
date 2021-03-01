import { Profile, ReadWriteWallet, WalletData, WalletFlag } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, render, renderWithRouter } from "testing-library";
import * as utils from "utils/electron-utils";

import { WalletListItem } from "./WalletListItem";

const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
const history = createMemoryHistory();

let profile: Profile;
let wallet: ReadWriteWallet;

describe("WalletListItem", () => {
	beforeAll(() => {
		history.push(dashboardURL);
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		wallet.data().set(WalletFlag.Starred, true);
		wallet.data().set(WalletData.LedgerPath, "0");
	});

	it("should render", () => {
		const { container, getByText } = renderWithRouter(
			<table>
				<tbody>
					<Route path="/profiles/:profileId/dashboard">
						<WalletListItem wallet={wallet} />
					</Route>
				</tbody>
			</table>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByText(wallet.alias())).toBeTruthy();

		expect(container).toMatchSnapshot();
	});

	it("should render with default BTC as default exchangeCurrency", () => {
		const mockExchangeCurrency = jest.spyOn(wallet, "exchangeCurrency").mockReturnValue(undefined);
		const { container, getByText } = renderWithRouter(
			<table>
				<tbody>
					<Route path="/profiles/:profileId/dashboard">
						<WalletListItem wallet={wallet} />
					</Route>
				</tbody>
			</table>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByText(wallet.alias())).toBeTruthy();

		expect(container).toMatchSnapshot();
		mockExchangeCurrency.mockRestore();
	});

	it("should click a wallet and redirect to it", () => {
		const { getByText } = renderWithRouter(
			<table>
				<tbody>
					<Route path="/profiles/:profileId/dashboard">
						<WalletListItem
							wallet={wallet}
							onClick={() => history.push(`/profiles/${profile.id()}/wallets/${wallet.id()}`)}
						/>
					</Route>
				</tbody>
			</table>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(history.location.pathname).toBe(`/profiles/${profile.id()}/dashboard`);

		act(() => {
			fireEvent.click(getByText(wallet.alias()));
		});

		expect(history.location.pathname).toBe(`/profiles/${profile.id()}/wallets/${wallet.id()}`);
	});

	it.each(["light", "dark"])("should set %s shadow color on mouse events", (theme) => {
		jest.spyOn(utils, "shouldUseDarkColors").mockImplementation(() => theme === "dark");

		const walletId = "fake-id";

		const setState = jest.fn();
		const useStateSpy = jest.spyOn(React, "useState");

		useStateSpy.mockImplementation((state) => [state, setState]);

		const { asFragment, getByText } = render(
			<table>
				<tbody>
					<WalletListItem wallet={wallet} activeWalletId={walletId} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();

		fireEvent.mouseEnter(getByText(wallet.alias()));
		fireEvent.mouseLeave(getByText(wallet.alias()));

		expect(setState).toHaveBeenCalledWith("--theme-background-color");
	});

	it.each(["light", "dark"])("should set %s shadow color on mouse events for selected wallet", (theme) => {
		jest.spyOn(utils, "shouldUseDarkColors").mockImplementation(() => theme === "dark");

		const walletId = "ac38fe6d-4b67-4ef1-85be-17c5f6841129";

		const setState = jest.fn();
		const useStateSpy = jest.spyOn(React, "useState");

		useStateSpy.mockImplementation((state) => [state, setState]);

		const { asFragment, getByText } = render(
			<table>
				<tbody>
					<WalletListItem wallet={wallet} activeWalletId={walletId} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();

		fireEvent.mouseEnter(getByText(wallet.alias()));
		fireEvent.mouseLeave(getByText(wallet.alias()));

		expect(setState).toHaveBeenCalledWith(theme === "dark" ? "--theme-black" : "--theme-color-secondary-100");
	});
});
