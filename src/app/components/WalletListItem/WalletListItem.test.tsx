import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter } from "testing-library";

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

		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		wallet.data().set(Contracts.WalletFlag.Starred, true);
		wallet.data().set(Contracts.WalletData.DerivationPath, "0");

		await env.profiles().restore(profile);
		await profile.sync();
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
				history,
				routes: [dashboardURL],
			},
		);

		expect(getByText(wallet.alias())).toBeTruthy();

		expect(container).toMatchSnapshot();
	});

	it("should render for selected wallet", () => {
		jest.spyOn(wallet.network(), "isTest").mockReturnValue(false);

		const walletId = "ac38fe6d-4b67-4ef1-85be-17c5f6841129";

		const { asFragment, queryByText } = renderWithRouter(
			<table>
				<tbody>
					<Route path="/profiles/:profileId/dashboard">
						<WalletListItem wallet={wallet} activeWalletId={walletId} />
					</Route>
				</tbody>
			</table>,
			{
				history,
				routes: [dashboardURL],
			},
		);

		expect(asFragment()).toMatchSnapshot();
		expect(queryByText("N/A")).toBeNull();
	});

	it("should render with a N/A for fiat", () => {
		jest.spyOn(wallet.network(), "isTest").mockReturnValue(true);

		const walletId = "ac38fe6d-4b67-4ef1-85be-17c5f6841129";

		const { asFragment, getByText } = renderWithRouter(
			<table>
				<tbody>
					<Route path="/profiles/:profileId/dashboard">
						<WalletListItem wallet={wallet} activeWalletId={walletId} />
					</Route>
				</tbody>
			</table>,
			{
				history,
				routes: [dashboardURL],
			},
		);

		expect(asFragment()).toMatchSnapshot();
		expect(getByText("N/A")).toBeInTheDocument();
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
				history,
				routes: [dashboardURL],
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
				history,
				routes: [dashboardURL],
			},
		);

		expect(history.location.pathname).toBe(`/profiles/${profile.id()}/dashboard`);

		act(() => {
			fireEvent.click(getByText(wallet.alias()));
		});

		expect(history.location.pathname).toBe(`/profiles/${profile.id()}/wallets/${wallet.id()}`);
	});
});
