import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, render, renderWithRouter } from "testing-library";

import { WalletListItem } from "./WalletListItem";

const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
const history = createMemoryHistory();

let profile: Contracts.IProfile;
let wallet: Contracts.ReadWriteWallet;

describe("WalletListItem", () => {
	beforeAll(() => {
		history.push(dashboardURL);
	});

	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());

		await env.profiles().restore(profile);
		await profile.sync();

		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		wallet.data().set(Contracts.WalletFlag.Starred, true);
		wallet.data().set(Contracts.WalletData.LedgerPath, "0");

		await wallet.synchronizer().identity();
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

	it("should render for selected wallet", () => {
		const walletId = "ac38fe6d-4b67-4ef1-85be-17c5f6841129";

		const { asFragment } = render(
			<table>
				<tbody>
					<WalletListItem wallet={wallet} activeWalletId={walletId} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
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
});
