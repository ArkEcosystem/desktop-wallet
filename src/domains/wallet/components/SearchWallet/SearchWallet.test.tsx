/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor, within } from "testing-library";

import { translations } from "../../i18n";
import { SearchWallet } from "./SearchWallet";

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
let wallets: ReadWriteWallet[];
let profile: Profile;

describe.each([true, false])("SearchWallet uses fiat value = %s", (showFiatValue) => {
	beforeAll(() => {
		history.push(dashboardURL);
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());

		wallets = profile.wallets().values();
		wallets[0].settings().set(WalletSetting.Alias, "Sample Wallet");
	});

	it("should render", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<SearchWallet
					profile={profile}
					showFiatValue={showFiatValue}
					isOpen={true}
					title={translations.MODAL_SELECT_ACCOUNT.TITLE}
					description={translations.MODAL_SELECT_ACCOUNT.DESCRIPTION}
					wallets={wallets}
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.TITLE),
		);
		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.DESCRIPTION),
		);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render with the default exchange currency enabled from profile settings", async () => {
		const walletWithExchangeCurrencyMock = jest.spyOn(wallets[0], "exchangeCurrency").mockReturnValue(undefined);
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<SearchWallet
					profile={profile}
					showFiatValue={showFiatValue}
					isOpen={true}
					title={translations.MODAL_SELECT_ACCOUNT.TITLE}
					description={translations.MODAL_SELECT_ACCOUNT.DESCRIPTION}
					wallets={wallets}
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.TITLE),
		);
		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.DESCRIPTION),
		);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());

		walletWithExchangeCurrencyMock.mockRestore();
	});

	it("should handle close", () => {
		const onClose = jest.fn();

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<SearchWallet profile={profile} isOpen={true} onClose={onClose} showFiatValue={showFiatValue} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		fireEvent.click(getByTestId("modal__close-btn"));
		expect(onClose).toHaveBeenCalled();
	});

	it("should filter wallets by address", async () => {
		jest.useFakeTimers();

		const { getByTestId, queryAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<SearchWallet
					profile={profile}
					isOpen={true}
					title={translations.MODAL_SELECT_ACCOUNT.TITLE}
					description={translations.MODAL_SELECT_ACCOUNT.DESCRIPTION}
					wallets={wallets}
					showFiatValue={showFiatValue}
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.TITLE),
		);
		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.DESCRIPTION),
		);

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(2));

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__button"));
		});

		await waitFor(() => expect(getByTestId("header-search-bar__input")).toBeInTheDocument());
		const searchInput = within(getByTestId("header-search-bar__input")).getByTestId("Input");
		await waitFor(() => expect(searchInput).toBeInTheDocument());

		act(() => {
			fireEvent.change(searchInput, { target: { value: "D8rr7B1d6TL6pf1" } });
		});

		act(() => {
			jest.advanceTimersByTime(100);
		});

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(1));
		jest.useRealTimers();
	});

	it("should filter wallets by alias", async () => {
		jest.useFakeTimers();

		const { getByTestId, queryAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<SearchWallet
					profile={profile}
					isOpen={true}
					title={translations.MODAL_SELECT_ACCOUNT.TITLE}
					description={translations.MODAL_SELECT_ACCOUNT.DESCRIPTION}
					wallets={wallets}
					showFiatValue={showFiatValue}
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.TITLE),
		);
		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.DESCRIPTION),
		);

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(2));

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__button"));
		});

		await waitFor(() => expect(getByTestId("header-search-bar__input")).toBeInTheDocument());
		const searchInput = within(getByTestId("header-search-bar__input")).getByTestId("Input");
		await waitFor(() => expect(searchInput).toBeInTheDocument());

		act(() => {
			fireEvent.change(searchInput, { target: { value: "Sample Wallet" } });
		});

		act(() => {
			jest.advanceTimersByTime(100);
		});

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(1));

		jest.useRealTimers();
	});

	it("should reset wallet search", async () => {
		jest.useFakeTimers();

		const { getByTestId, queryAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<SearchWallet
					profile={profile}
					isOpen={true}
					title={translations.MODAL_SELECT_ACCOUNT.TITLE}
					description={translations.MODAL_SELECT_ACCOUNT.DESCRIPTION}
					wallets={wallets}
					showFiatValue={showFiatValue}
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.TITLE),
		);
		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.DESCRIPTION),
		);

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(2));

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__button"));
		});

		await waitFor(() => expect(getByTestId("header-search-bar__input")).toBeInTheDocument());
		const searchInput = within(getByTestId("header-search-bar__input")).getByTestId("Input");
		await waitFor(() => expect(searchInput).toBeInTheDocument());

		// Search by wallet alias
		act(() => {
			fireEvent.change(searchInput, { target: { value: "Sample Wallet" } });
		});

		act(() => {
			jest.advanceTimersByTime(100);
		});

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(1));

		// Reset search
		act(() => {
			fireEvent.click(getByTestId("header-search-bar__reset"));
		});

		await waitFor(() => expect(searchInput).toHaveValue(""));
		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(2));

		jest.useRealTimers();
	});

	it("should not find search wallet and show empty results screen", async () => {
		jest.useFakeTimers();

		const { getByTestId, queryAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<SearchWallet
					profile={profile}
					isOpen={true}
					title={translations.MODAL_SELECT_ACCOUNT.TITLE}
					description={translations.MODAL_SELECT_ACCOUNT.DESCRIPTION}
					wallets={wallets}
					showFiatValue={showFiatValue}
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.TITLE),
		);
		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SELECT_ACCOUNT.DESCRIPTION),
		);

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(2));

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__button"));
		});

		await waitFor(() => expect(getByTestId("header-search-bar__input")).toBeInTheDocument());
		const searchInput = within(getByTestId("header-search-bar__input")).getByTestId("Input");
		await waitFor(() => expect(searchInput).toBeInTheDocument());

		await act(async () => {
			fireEvent.change(getByTestId("Input"), {
				target: {
					value: "non existent wallet name",
				},
			});
		});

		act(() => {
			jest.advanceTimersByTime(100);
		});

		await waitFor(() => expect(getByTestId("Input")).toHaveValue("non existent wallet name"));
		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(0));

		await waitFor(() => expect(getByTestId("EmptyResults")).toBeInTheDocument());

		jest.useRealTimers();
	});
});
