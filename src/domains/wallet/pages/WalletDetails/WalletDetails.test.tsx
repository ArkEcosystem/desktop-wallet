/* eslint-disable @typescript-eslint/require-await */
import { Profile, Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import walletMock from "tests/fixtures/coins/ark/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD.json";
import {
	act,
	env,
	fireEvent,
	getDefaultProfileId,
	renderWithRouter,
	useDefaultNetMocks,
	waitFor,
} from "utils/testing-library";

import { WalletDetails } from "./WalletDetails";

const history = createMemoryHistory();
let dashboardURL: string;

let profile: Profile;
let wallet: Wallet;
let blankWallet: Wallet;
let unvotedWallet: Wallet;

let emptyProfile: Profile;
let wallet2: Wallet;

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
	await waitFor(() => expect(rendered.queryAllByTestId("TransactionRow")).toHaveLength(20));
	return rendered;
};

describe("WalletDetails", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		blankWallet = await profile.wallets().importByMnemonic(passphrase2, "ARK", "devnet");
		unvotedWallet = await profile.wallets().importByMnemonic("unvoted wallet", "ARK", "devnet");

		// emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		// wallet2 = await emptyProfile.wallets().importByMnemonic("wallet 2", "ARK", "devnet");

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
			.get(`/api/wallets/${blankWallet.address()}`)
			.reply(404, {
				statusCode: 404,
				error: "Not Found",
				message: "Wallet not found",
			})
			.get(`/api/wallets/${blankWallet.address()}/votes`)
			.reply(404, {
				statusCode: 404,
				error: "Not Found",
				message: "Wallet not found",
			})
			// .get(`/api/wallets/${wallet2.address()}`)
			// .reply(404, {
			// 	statusCode: 404,
			// 	error: "Not Found",
			// 	message: "Wallet not found",
			// })
			// .get(`/api/wallets/${wallet2.address()}/votes`)
			// .reply(404, {
			// 	statusCode: 404,
			// 	error: "Not Found",
			// 	message: "Wallet not found",
			// })
			.post("/api/transactions/search")
			.query(true)
			.reply(200, require("tests/fixtures/coins/ark/transactions.json"))
			.persist();
	});

	beforeEach(() => {
		dashboardURL = `/profiles/${profile.id()}/wallets/${wallet.id()}`;
		history.push(dashboardURL);
	});

	it("should render", async () => {
		const { getByTestId, asFragment, getAllByTestId } = await renderPage();

		await waitFor(() => expect(getAllByTestId("WalletVote")).toHaveLength(1));

		expect(getByTestId("WalletHeader__address-publickey")).toHaveTextContent(wallet.address());
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

	it("should fetch more transactions", async () => {
		const { getByTestId, getAllByTestId } = await renderPage();

		await waitFor(() => expect(getAllByTestId("WalletVote")).toHaveLength(1));

		const pendingFetchMoreBtn = getByTestId("pending-transactions__fetch-more-button");
		const fetchMoreTransactionsBtn = getByTestId("transactions__fetch-more-button");

		act(() => {
			fireEvent.click(pendingFetchMoreBtn);
		});

		act(() => {
			fireEvent.click(fetchMoreTransactionsBtn);
		});

		await waitFor(
			() => {
				expect(getAllByTestId("TransactionRow")).toHaveLength(40);
			},
			{ timeout: 2000 },
		);
	});

	it("should delete wallet", async () => {
		const { getByTestId, getAllByTestId } = await renderPage();
		await waitFor(() => expect(getAllByTestId("WalletVote")).toHaveLength(1));

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
	// it("should not render the bottom sheet menu when there is only one wallet", async () => {
	// 	dashboardURL = `/profiles/${emptyProfile.id()}/wallets/${wallet2.id()}`;
	// 	history.push(dashboardURL);
	//
	// 	const { asFragment, getByTestId, queryAllByTestId } = await renderPage();
	//
	// 	expect(getByTestId("WalletHeader__address-publickey")).toHaveTextContent(wallet2.address());
	// 	expect(queryAllByTestId("WalletBottomSheetMenu")).toHaveLength(0);
	// 	expect(asFragment()).toMatchSnapshot();
	// });
});
