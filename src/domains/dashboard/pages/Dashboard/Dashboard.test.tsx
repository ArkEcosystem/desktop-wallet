import { Profile } from "@arkecosystem/platform-sdk-profiles";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor, within } from "utils/testing-library";

import { balances } from "../../data";
import { Dashboard } from "./Dashboard";

const history = createMemoryHistory();
let emptyProfile: Profile;

const fixtureProfileId = getDefaultProfileId();
let dashboardURL: string;

const transport: typeof Transport = createTransportReplayer(RecordStore.fromString(""));

beforeEach(() => {
	emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
	dashboardURL = `/profiles/${fixtureProfileId}/dashboard`;
	history.push(dashboardURL);
	nock.disableNetConnect();

	nock("https://dwallets.ark.io")
		.post("/api/transactions/search")
		.query(true)
		.reply(200, () => {
			const { meta, data } = require("tests/fixtures/coins/ark/transactions.json");
			return {
				meta,
				data: data.slice(0, 2),
			};
		})
		.persist();
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

		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));
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

		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));

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
		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("item-percentage")).toHaveLength(1));
		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));

		act(() => {
			fireEvent.click(within(getByTestId("WalletControls")).getByTestId("dropdown__toggle"));
		});

		act(() => {
			fireEvent.click(getByTestId("filter-wallets_toggle--transactions"));
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render portfolio percentage bar", async () => {
		const { asFragment, getByTestId, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("item-percentage")).toHaveLength(1));
		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render portfolio chart", async () => {
		const { asFragment, getByTestId, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("item-percentage")).toHaveLength(1));
		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should hide portfolio view", async () => {
		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("item-percentage")).toHaveLength(1));
		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));

		const filterNetwork = within(getByTestId("WalletControls")).getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(filterNetwork);
		});

		const toggle = getByTestId("filter-wallets_toggle--portfolio");
		act(() => {
			fireEvent.click(toggle);
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to import ledger page", async () => {
		const unsubscribe = jest.fn();
		let observer: Observer<any>;
		const listenSpy = jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe };
		});

		const { asFragment, getAllByTestId, getByTestId, getByText, queryByTestId } = renderWithRouter(
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

		await waitFor(() => expect(getAllByTestId("item-percentage")).toHaveLength(1));
		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));

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
		const { asFragment, getAllByTestId, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("item-percentage")).toHaveLength(1));
		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));

		act(() => {
			fireEvent.click(getByText("Import"));
		});

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/wallets/import`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to create page", async () => {
		const { asFragment, getAllByTestId, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard balances={balances} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("item-percentage")).toHaveLength(1));
		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));

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

		await waitFor(() => {
			expect(getByTestId("transactions__fetch-more-button")).toHaveTextContent("View More");
			expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4);
		});

		act(() => {
			fireEvent.click(getByTestId("transactions__fetch-more-button"));
		});

		expect(getByTestId("transactions__fetch-more-button")).toHaveTextContent(commonTranslations.LOADING);

		await waitFor(() => {
			expect(getByTestId("transactions__fetch-more-button")).toHaveTextContent(commonTranslations.VIEW_MORE);
			expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(8);
		});

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

		await waitFor(() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4));

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
