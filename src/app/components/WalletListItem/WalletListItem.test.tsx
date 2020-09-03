import { Profile, ReadWriteWallet, WalletFlag } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter } from "testing-library";

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
		wallet.data().set(WalletFlag.Ledger, true);
	});

	it("should render", () => {
		const { container, getAllByTestId } = renderWithRouter(
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

		expect(getAllByTestId(`WalletListItem__${wallet.address()}`)).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	it("should trigger onAction callback if provided", () => {
		const fn = jest.fn();
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];

		const { getByTestId, container } = renderWithRouter(
			<table>
				<tbody>
					<Route path="/profiles/:profileId/dashboard">
						<WalletListItem wallet={wallet} actions={options} onAction={fn} />
					</Route>
				</tbody>
			</table>,
			{
				routes: [dashboardURL],
				history,
			},
		);
		const toggle = getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("dropdown__option--0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(container.querySelectorAll("ul").length).toEqual(0);
		expect(fn).toHaveBeenCalled();
	});

	it("should ignore onAction callback if not provided", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];

		const { getByTestId, container } = renderWithRouter(
			<table>
				<tbody>
					<Route path="/profiles/:profileId/dashboard">
						<WalletListItem wallet={wallet} actions={options} />
					</Route>
				</tbody>
			</table>,
			{
				routes: [dashboardURL],
				history,
			},
		);
		const toggle = getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("dropdown__option--0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(container.querySelectorAll("ul").length).toEqual(0);
	});

	it("should click a wallet and redirect to it", () => {
		const { getByTestId } = renderWithRouter(
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

		expect(history.location.pathname).toBe(`/profiles/${profile.id()}/dashboard`);

		act(() => {
			fireEvent.click(getByTestId(`WalletListItem__${wallet.address()}`));
		});

		expect(history.location.pathname).toBe(`/profiles/${profile.id()}/wallets/${wallet.id()}`);
	});
});
