import { Profile, ProfileSetting, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
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
	waitFor,
	within,
} from "utils/testing-library";

import { Wallets } from "./Wallets";

const history = createMemoryHistory();
const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;

let profile: Profile;
let emptyProfile: Profile;
let wallets: ReadWriteWallet[];

const transport: typeof Transport = createTransportReplayer(RecordStore.fromString(""));

describe("Wallets", () => {
	beforeAll(async () => {
		nock("https://neoscan.io/api/main_net/v1/")
			.get("/get_last_transactions_by_address/AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX/1")
			.reply(200, []);

		history.push(dashboardURL);

		emptyProfile = env.profiles().create("Empty");
		profile = env.profiles().findById(getDefaultProfileId());
		wallets = profile.wallets().values();

		const wallet = await profile
			.wallets()
			.importByAddress("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX", "ARK", "ark.mainnet");

		await syncDelegates();
		await wallet.syncVotes();
	});

	it("should render grid", () => {
		const { asFragment, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getAllByTestId("WalletsGrid")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render list", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		const toggle = getByTestId("LayoutControls__list--icon");
		act(() => {
			fireEvent.click(toggle);
		});

		await waitFor(() => expect(getByTestId("WalletsList")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle between grid and list view", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__list--icon"));
		});

		await waitFor(() => expect(getByTestId("WalletsList")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("LayoutControls__grid--icon"));
		});

		expect(getByTestId("WalletsGrid")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle wallet creation", () => {
		const onCreateWallet = jest.fn();
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets onCreateWallet={onCreateWallet} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		fireEvent.click(getByTestId("WalletControls__create-wallet"));

		expect(onCreateWallet).toHaveBeenCalled();
	});

	it("should handle wallet import", () => {
		const onImportWallet = jest.fn();
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets onImportWallet={onImportWallet} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		fireEvent.click(getByTestId("WalletControls__import-wallet"));

		expect(onImportWallet).toHaveBeenCalled();
	});

	it("should handle filter change", async () => {
		const { getByTestId, findByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		const dropdown = getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdown);
		});

		await findByTestId("filter-wallets_toggle--transactions");

		const toggle = getByTestId("filter-wallets_toggle--transactions");
		act(() => {
			fireEvent.click(toggle);
		});

		await waitFor(() => expect(getByTestId("filter-wallets_toggle--transactions")).toHaveAttribute("checked"));
	});

	it("should open and close ledger import modal", async () => {
		const unsubscribe = jest.fn();
		let observer: Observer<any>;
		const listenSpy = jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe };
		});

		const { asFragment, getByTestId, getByText, queryByTestId, getAllByRole } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<LedgerProvider transport={transport}>
					<Wallets />
				</LedgerProvider>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

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

		expect(asFragment()).toMatchSnapshot();
		listenSpy.mockReset();
	});

	it("should handle list wallet click", () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		const toggle = getByTestId("LayoutControls__list--icon");
		act(() => {
			fireEvent.click(toggle);
		});

		act(() => {
			fireEvent.click(within(getByTestId("WalletTable")).getByText(wallets[0].alias()!));
		});

		expect(history.location.pathname).toMatch(`/profiles/${profile.id()}/wallets/${wallets[0].id()}`);
	});

	it("should render without testnet wallets", () => {
		profile.settings().set(ProfileSetting.UseTestNetworks, false);

		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render empty profile wallets", async () => {
		history.push(`/profiles/${emptyProfile.id()}/dashboard`);

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<Wallets />
			</Route>,
			{
				routes: [`/profiles/${emptyProfile.id()}/dashboard`],
				history,
			},
		);

		const toggle = getByTestId("LayoutControls__list--icon");
		act(() => {
			fireEvent.click(toggle);
		});

		await waitFor(() => expect(getByTestId("WalletsList")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});
});
