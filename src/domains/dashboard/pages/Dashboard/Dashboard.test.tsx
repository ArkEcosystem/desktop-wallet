/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
import * as useRandomNumberHook from "app/hooks/use-random-number";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import {
	act,
	env,
	fireEvent,
	getDefaultProfileId,
	renderWithRouter,
	syncDelegates,
	useDefaultNetMocks,
	waitFor,
	within,
} from "utils/testing-library";

import { balances } from "../../data";
import { Dashboard } from "./Dashboard";

const history = createMemoryHistory();
let emptyProfile: Profile;

const fixtureProfileId = getDefaultProfileId();
let dashboardURL: string;

const transport: typeof Transport = createTransportReplayer(RecordStore.fromString(""));

beforeAll(async () => {
	useDefaultNetMocks();

	nock("https://neoscan.io/api/main_net/v1/")
		.get("/get_last_transactions_by_address/AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX/1")
		.reply(200, []);

	nock("https://dwallets.ark.io")
		.get("/api/transactions")
		.query(true)
		.reply(200, () => {
			const { meta, data } = require("tests/fixtures/coins/ark/devnet/transactions.json");
			return {
				meta,
				data: data.slice(0, 2),
			};
		})
		.persist();

	const profile = env.profiles().findById(fixtureProfileId);
	const wallet = await profile.wallets().importByAddress("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX", "ARK", "ark.mainnet");

	jest.spyOn(useRandomNumberHook, "useRandomNumber").mockImplementation(() => 1);

	await syncDelegates();
	await wallet.syncVotes();
});

afterAll(() => {
	useRandomNumberHook.useRandomNumber.mockRestore();
});

beforeEach(() => {
	emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
	dashboardURL = `/profiles/${fixtureProfileId}/dashboard`;
	history.push(dashboardURL);
});

describe("Dashboard", () => {
	it("should render", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(
			() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4),
			{ timeout: 5000 },
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render wallets", async () => {
		Promise.resolve().then(() => jest.useFakeTimers());

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(
			() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4),
			{ timeout: 5000 },
		);

		Promise.resolve().then(() => jest.advanceTimersByTime(1000));

		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render with no wallets", async () => {
		dashboardURL = `/profiles/${emptyProfile.id()}/dashboard`;
		history.push(dashboardURL);

		Promise.resolve().then(() => jest.useFakeTimers());

		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		Promise.resolve().then(() => jest.advanceTimersByTime(1000));

		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should hide transaction view", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await act(async () => {
			await waitFor(
				() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4),
				{ timeout: 5000 },
			);

			fireEvent.click(within(getByTestId("WalletControls")).getByTestId("dropdown__toggle"));

			await waitFor(() => expect(getByTestId("filter-wallets_toggle--transactions")).toBeTruthy());

			fireEvent.click(getByTestId("filter-wallets_toggle--transactions"));

			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should show transaction view", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await act(async () => {
			fireEvent.click(within(getByTestId("WalletControls")).getByTestId("dropdown__toggle"));

			await waitFor(() => expect(getByTestId("filter-wallets_toggle--transactions")).toBeTruthy());

			fireEvent.click(getByTestId("filter-wallets_toggle--transactions"));

			await waitFor(
				() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4),
				{ timeout: 5000 },
			);
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should render portfolio percentage bar", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(
			() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4),
			{ timeout: 5000 },
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render portfolio chart", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(
			() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4),
			{ timeout: 5000 },
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should change wallet view type from grid to list", async () => {
		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await act(async () => {
			const toggle = getByTestId("LayoutControls__list--icon");

			await waitFor(() => expect(getAllByTestId("Card")).toHaveLength(3));

			fireEvent.click(toggle);

			await waitFor(() => expect(() => getAllByTestId("WalletTable")).toBeTruthy());

			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should hide portfolio view", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await act(async () => {
			await waitFor(
				() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4),
				{ timeout: 5000 },
			);

			fireEvent.click(within(getByTestId("WalletControls")).getByTestId("dropdown__toggle"));

			await waitFor(() =>
				expect(within(getByTestId("FilterWallets")).getByTestId("dropdown__toggle")).toBeTruthy(),
			);

			const toggle = within(getByTestId("FilterWallets")).getByTestId("dropdown__toggle");

			fireEvent.click(toggle);

			await waitFor(() => expect(getByTestId("filter-wallets__wallets")).toBeTruthy());

			const firstOption = getByTestId("dropdown__option--0");
			await waitFor(() => expect(firstOption).toBeTruthy());

			fireEvent.click(firstOption);

			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should select an option in the wallets display type", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await act(async () => {
			await waitFor(
				() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4),
				{ timeout: 5000 },
			);

			fireEvent.click(within(getByTestId("WalletControls")).getByTestId("dropdown__toggle"));

			await waitFor(() => expect(getByTestId("filter-wallets_toggle--portfolio")).toBeTruthy());

			fireEvent.click(getByTestId("filter-wallets_toggle--portfolio"));

			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should navigate to import ledger page", async () => {
		const unsubscribe = jest.fn();
		let observer: Observer<any>;
		const listenSpy = jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe };
		});

		const { asFragment, getByTestId, getByText, queryByTestId, getAllByRole } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<LedgerProvider transport={transport}>
					<Dashboard />
				</LedgerProvider>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByRole("row").length).toBeGreaterThan(1));

		act(() => {
			fireEvent.click(getByText("Import Ledger"));
		});

		await waitFor(() => expect(getByTestId("LedgerWaitingDevice-description")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		await waitFor(() => expect(queryByTestId("LedgerWaitingDevice-description")).not.toBeInTheDocument());

		act(() => {
			fireEvent.click(getByText("Import Ledger"));
		});

		await waitFor(() => expect(getByTestId("LedgerWaitingDevice-description")).toBeInTheDocument());

		act(() => {
			observer!.next({ type: "add", descriptor: "" });
		});

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/wallets/import`);
		expect(asFragment()).toMatchSnapshot();
		listenSpy.mockReset();
	});

	it("should navigate to import page", async () => {
		const { asFragment, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(
			() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4),
			{ timeout: 5000 },
		);

		act(() => {
			fireEvent.click(getByText("Import"));
		});

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/wallets/import`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to create page", async () => {
		const { asFragment, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(
			() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4),
			{ timeout: 5000 },
		);

		fireEvent.click(getByText("Create"));

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/wallets/create`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fetch more transactions", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(
			() => {
				expect(getByTestId("transactions__fetch-more-button")).toHaveTextContent("View More");
				expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4);
			},
			{ timeout: 5000 },
		);

		act(() => {
			fireEvent.click(getByTestId("transactions__fetch-more-button"));
		});

		expect(getByTestId("transactions__fetch-more-button")).toHaveTextContent(commonTranslations.LOADING);

		await waitFor(
			() => {
				expect(getByTestId("transactions__fetch-more-button")).toHaveTextContent(commonTranslations.VIEW_MORE);
				expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(8);
			},
			{ timeout: 5000 },
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should open detail modal on transaction row click", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(
			() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4),
			{ timeout: 5000 },
		);

		act(() => {
			fireEvent.click(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")[0]);
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeInTheDocument();
		});

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
