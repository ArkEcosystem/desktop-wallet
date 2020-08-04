/* eslint-disable @typescript-eslint/require-await */
import { Profile, Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
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
	useDefaultNetMocks,
	waitFor,
} from "testing-library";
import walletMock from "tests/fixtures/coins/ark/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD.json";

import { WalletDetails } from "./WalletDetails";

const history = createMemoryHistory();
let dashboardURL: string;

let profile: Profile;
let wallet: Wallet;
let blankWallet: Wallet;
let unvotedWallet: Wallet;

const passphrase2 = "power return attend drink piece found tragic fire liar page disease combine";

const renderPage = async () => {
	const rendered = renderWithRouter(
		<Route path="/profiles/:profileId/wallets/:walletId">
			<WalletDetails />
		</Route>,
		{
			routes: [dashboardURL],
			history,
		},
	);

	jest.useRealTimers();

	// Wait for fetch before unmount
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
	});

	await waitFor(() => expect(rendered.getByTestId("WalletHeader")).toBeInTheDocument());
	await waitFor(() => expect(rendered.getAllByTestId("TransactionRow")).toHaveLength(4));

	return rendered;
};

beforeAll(async () => {
	profile = env.profiles().findById(getDefaultProfileId());
	wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
	blankWallet = await profile.wallets().importByMnemonic(passphrase2, "ARK", "devnet");
	unvotedWallet = await profile.wallets().importByMnemonic("unvoted wallet", "ARK", "devnet");

	useDefaultNetMocks();

	nock("https://dwallets.ark.io")
		.get(`/api/wallets/${unvotedWallet.address()}`)
		.reply(200, walletMock)
		.get(`/api/wallets/${unvotedWallet.address()}/votes`)
		.reply(200, {
			meta: {
				totalCountIsEstimate: false,
				count: 0,
				pageCount: 1,
				totalCount: 0,
				next: null,
				previous: null,
				self: "/wallets/AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX/votes?transform=true&page=1&limit=100",
				first: "/wallets/AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX/votes?transform=true&page=1&limit=100",
				last: null,
			},
			data: [],
		})
		.get(/\/api\/wallets\/.+/)
		.reply(404, {
			statusCode: 404,
			error: "Not Found",
			message: "Wallet not found",
		})
		.get(/\/api\/wallets\/.+\/votes/)
		.reply(404, {
			statusCode: 404,
			error: "Not Found",
			message: "Wallet not found",
		})
		.post("/api/transactions/search")
		.reply(200, require("tests/fixtures/coins/ark/transactions.json"))
		.persist();
});

beforeEach(() => {
	dashboardURL = `/profiles/${profile.id()}/wallets/${wallet.id()}`;
	history.push(dashboardURL);
});

describe("WalletDetails", () => {
	it("should render", async () => {
		const { asFragment, getByTestId } = await renderPage();

		await waitFor(() => expect(getByTestId("WalletHeader__address-publickey")).toHaveTextContent(wallet.address()));
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render with timers", async () => {
		jest.useFakeTimers();
		const { asFragment } = await renderPage();

		act(() => {
			jest.useFakeTimers();
			jest.advanceTimersByTime(30000);
			jest.useRealTimers();
		});

		// Wait for fetch before unmount
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render when wallet not found for votes", async () => {
		dashboardURL = `/profiles/${profile.id()}/wallets/${blankWallet.id()}`;
		history.push(dashboardURL);

		const { asFragment, getByTestId } = await renderPage();

		expect(getByTestId("WalletHeader__address-publickey")).toHaveTextContent(blankWallet.address());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render when wallet hasn't voted", async () => {
		dashboardURL = `/profiles/${profile.id()}/wallets/${unvotedWallet.id()}`;
		history.push(dashboardURL);

		const { asFragment, getByTestId } = await renderPage();

		expect(getByTestId("WalletHeader__address-publickey")).toHaveTextContent(unvotedWallet.address());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render the bottom sheet menu when there is only one wallet", async () => {
		const profile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		const wallet2 = await profile.wallets().importByAddress(wallet.address(), "ARK", "devnet");

		dashboardURL = `/profiles/${profile.id()}/wallets/${wallet2.id()}`;
		history.push(dashboardURL);

		const { asFragment, queryByTestId } = await renderPage();

		// Wait for fetch before unmount
		await act(async () => new Promise((resolve) => setTimeout(resolve, 1000)));

		expect(queryByTestId("WalletBottomSheetMenu")).toBeNull();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete wallet", async () => {
		const deleteWallet = await profile.wallets().importByMnemonic("delete wallet", "ARK", "devnet");
		dashboardURL = `/profiles/${profile.id()}/wallets/${deleteWallet.id()}`;
		history.push(dashboardURL);

		const { getByTestId, getAllByTestId, asFragment } = await renderPage();

		expect(asFragment()).toMatchSnapshot();

		const dropdown = getAllByTestId("dropdown__toggle")[2];
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const deleteWalletOption = getByTestId("dropdown__option--4");
		expect(deleteWalletOption).toBeTruthy();

		act(() => {
			fireEvent.click(deleteWalletOption);
		});

		expect(profile.wallets().count()).toEqual(4);
		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("DeleteResource__submit-button"));
		});

		await waitFor(() => expect(profile.wallets().count()).toEqual(3));
	});

	it("should update wallet name", async () => {
		const { getByTestId, getAllByTestId, asFragment } = await renderPage();

		const dropdown = getAllByTestId("dropdown__toggle")[2];
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const updateWalletNameOption = getByTestId("dropdown__option--0");
		expect(updateWalletNameOption).toBeTruthy();

		act(() => {
			fireEvent.click(updateWalletNameOption);
		});

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		const name = "Sample label name";
		const updateNameInput = getByTestId("UpdateWalletName__input");

		act(() => {
			fireEvent.change(updateNameInput, { target: { value: name } });
		});

		expect(updateNameInput).toHaveValue(name);

		const submitBtn = getByTestId("UpdateWalletName__submit");

		act(() => {
			fireEvent.click(submitBtn);
		});

		wallet.settings().set(WalletSetting.Alias, name);
		await waitFor(() => expect(wallet.settings().get(WalletSetting.Alias)).toEqual(name));

		expect(asFragment()).toMatchSnapshot();
	});
});
