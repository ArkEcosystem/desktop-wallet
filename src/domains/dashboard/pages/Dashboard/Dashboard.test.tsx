/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
import * as useRandomNumberHook from "app/hooks/use-random-number";
import { toasts } from "app/services";
import { translations as dashboardTranslations } from "domains/dashboard/i18n";
import { translations as profileTranslations } from "domains/profile/i18n";
import { translations as walletTranslations } from "domains/wallet/i18n";
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

import { Dashboard } from "./Dashboard";

const history = createMemoryHistory();
let profile: Contracts.IProfile;

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

	profile = env.profiles().findById(fixtureProfileId);
	await env.profiles().restore(profile);
	await profile.sync();

	const wallet = await profile.walletFactory().fromAddress({
		address: "AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX",
		coin: "ARK",
		network: "ark.mainnet",
	});
	profile.wallets().push(wallet);

	await syncDelegates(profile);

	jest.spyOn(useRandomNumberHook, "useRandomNumber").mockImplementation(() => 1);
});

afterAll(() => {
	useRandomNumberHook.useRandomNumber.mockRestore();
});

beforeEach(() => {
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
				withProfileSynchronizer: true,
			},
		);

		await waitFor(
			() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4),
			{ timeout: 4000 },
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show introductory tutorial", async () => {
		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => expect(getByText(profileTranslations.MODAL_PROFILE_CREATED.TITLE)).toBeInTheDocument());
	});

	it("should able to skip introductory tutorial", async () => {
		const { getByText, queryByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => expect(getByText(profileTranslations.MODAL_PROFILE_CREATED.TITLE)).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByText(profileTranslations.MODAL_PROFILE_CREATED.SKIP_TUTORIAL));
		});

		await waitFor(() =>
			expect(queryByText(profileTranslations.MODAL_PROFILE_CREATED.TITLE)).not.toBeInTheDocument(),
		);
	});

	it("should navigate to import ledger page", async () => {
		const unsubscribe = jest.fn();
		let observer: Observer<any>;
		const listenSpy = jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe };
		});
		profile.markIntroductoryTutorialAsComplete();

		const { asFragment, getByTestId, getByText, queryByText, getAllByRole } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<LedgerProvider transport={transport}>
					<Dashboard />
				</LedgerProvider>
			</Route>,
			{
				routes: [dashboardURL],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(() => expect(getAllByRole("row").length).toBeGreaterThan(1));

		act(() => {
			fireEvent.click(getByText(dashboardTranslations.WALLET_CONTROLS.IMPORT_LEDGER));
		});

		await waitFor(() =>
			expect(getByText(walletTranslations.MODAL_LEDGER_WALLET.CONNECT_DEVICE)).toBeInTheDocument(),
		);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		await waitFor(() =>
			expect(queryByText(walletTranslations.MODAL_LEDGER_WALLET.CONNECT_DEVICE)).not.toBeInTheDocument(),
		);

		act(() => {
			fireEvent.click(getByText(dashboardTranslations.WALLET_CONTROLS.IMPORT_LEDGER));
		});

		await waitFor(() =>
			expect(getByText(walletTranslations.MODAL_LEDGER_WALLET.CONNECT_DEVICE)).toBeInTheDocument(),
		);

		act(() => {
			observer!.next({ type: "add", descriptor: "" });
		});

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/wallets/import`);
		expect(asFragment()).toMatchSnapshot();
		listenSpy.mockReset();
	});

	it("should navigate to create wallet page", async () => {
		const { asFragment, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
				withProfileSynchronizer: true,
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

	it("should navigate to import wallet page", async () => {
		const { asFragment, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
				withProfileSynchronizer: true,
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

	it("should show warning for errored networks", async () => {
		const walletRestoreMock = jest
			.spyOn(profile.wallets().first(), "hasBeenPartiallyRestored")
			.mockReturnValue(true);

		const warningMock = jest.fn();
		const toastSpy = jest.spyOn(toasts, "warning").mockImplementation(warningMock);

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Dashboard />
			</Route>,
			{
				routes: [dashboardURL],
				history,
				withProfileSynchronizer: true,
			},
		);

		await waitFor(
			() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(4),
			{ timeout: 4000 },
		);

		expect(toastSpy).toHaveBeenCalled();

		expect(asFragment()).toMatchSnapshot();
		walletRestoreMock.mockRestore();
		toastSpy.mockRestore();
	});

	it("should render loading state when profile is syncing", async () => {
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
			() => expect(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")).toHaveLength(8),
			{ timeout: 4000 },
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
