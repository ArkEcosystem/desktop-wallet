/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import { when } from "jest-when";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import walletMock from "tests/fixtures/coins/ark/devnet/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD.json";
import {
	act,
	env,
	fireEvent,
	getDefaultProfileId,
	RenderResult,
	renderWithRouter,
	syncDelegates,
	waitFor,
	within,
} from "utils/testing-library";

import { WalletDetails } from "./WalletDetails";

const history = createMemoryHistory();
let walletUrl: string;

let profile: Profile;
let wallet: ReadWriteWallet;
let blankWallet: ReadWriteWallet;
let unvotedWallet: ReadWriteWallet;

let emptyProfile: Profile;
let wallet2: ReadWriteWallet;

const passphrase2 = "power return attend drink piece found tragic fire liar page disease combine";

const renderPage = async (waitForTopSection = true) => {
	let rendered: RenderResult;

	await act(async () => {
		rendered = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletDetails txSkeletonRowsLimit={1} transactionLimit={1} />
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);
	});

	const { getByTestId, queryAllByTestId } = rendered;

	if (waitForTopSection) {
		await waitFor(() => expect(queryAllByTestId("WalletVote")).toHaveLength(1));
		await waitFor(() => expect(queryAllByTestId("WalletRegistrations")).toHaveLength(1));
	}

	await waitFor(() => expect(within(getByTestId("TransactionTable")).queryAllByTestId("TableRow")).toHaveLength(1));

	return rendered;
};

describe("WalletDetails", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		blankWallet = await profile.wallets().importByMnemonic(passphrase2, "ARK", "ark.devnet");
		unvotedWallet = await profile.wallets().importByMnemonic("unvoted wallet", "ARK", "ark.devnet");

		emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		wallet2 = await emptyProfile.wallets().importByMnemonic("wallet 2", "ARK", "ark.devnet");

		await syncDelegates();
		await wallet.syncVotes();

		nock("https://dwallets.ark.io")
			.get("/api/delegates")
			.query({ page: "1" })
			.reply(200, require("tests/fixtures/coins/ark/devnet/delegates.json"))
			.get(`/api/wallets/${unvotedWallet.address()}`)
			.reply(200, walletMock)
			.get(`/api/wallets/${blankWallet.address()}`)
			.reply(404, {
				statusCode: 404,
				error: "Not Found",
				message: "Wallet not found",
			})
			.get(`/api/wallets/${wallet2.address()}`)
			.reply(404, {
				statusCode: 404,
				error: "Not Found",
				message: "Wallet not found",
			})
			.get("/api/transactions")
			.query((params) => !!params.address)
			.reply(200, (url, params) => {
				const { meta, data } = require("tests/fixtures/coins/ark/devnet/transactions.json");
				const filteredUrl =
					"/api/transactions?page=1&limit=1&address=D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD&type=0&typeGroup=1";
				if (url === filteredUrl) return { meta, data: [] };

				return {
					meta,
					data: data.slice(0, 1),
				};
			})
			.persist();
	});

	beforeEach(() => {
		walletUrl = `/profiles/${profile.id()}/wallets/${wallet.id()}`;
		history.push(walletUrl);
		jest.useFakeTimers();
		jest.advanceTimersByTime(30000);
	});

	it("should render", async () => {
		const { asFragment } = await renderPage();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render wallet vote when the network does not support votes", async () => {
		const networkFeatureSpy = jest.spyOn(wallet.network(), "can");

		when(networkFeatureSpy).calledWith("Transaction.vote").mockReturnValue(false);

		const { getByTestId } = await renderPage(false);

		await waitFor(() => {
			expect(() => getByTestId("WalletVote")).toThrow(/Unable to find an element by/);
		});

		networkFeatureSpy.mockRestore();
	});

	it("should not render wallet registrations when the network does not support second signatures, delegate registrations and entity registrations", async () => {
		const networkFeatureSpy = jest.spyOn(wallet, "canAny").mockReturnValue(false);

		const { getByTestId } = await renderPage(false);

		expect(() => getByTestId("WalletRegistrations")).toThrow(/Unable to find an element by/);

		networkFeatureSpy.mockRestore();
	});

	it.each([
		["second signatures", "secondSignature"],
		["delegate registrations", "delegateRegistration"],
		["entity registrations", "entityRegistration"],
	])("should render wallet registrations when the network does support %s", async (name, type) => {
		const networkFeatureSpy = jest.spyOn(wallet.network(), "can");

		when(networkFeatureSpy)
			.calledWith("Transaction.secondSignature")
			.mockReturnValue(false)
			.calledWith("Transaction.delegateRegistration")
			.mockReturnValue(false)
			.calledWith("Transaction.entityRegistration")
			.mockReturnValue(false)
			.calledWith(`Transaction.${type}`)
			.mockReturnValue(true);

		const { getAllByTestId } = await renderPage(false);

		await waitFor(() => expect(getAllByTestId("WalletRegistrations")).toHaveLength(1));

		networkFeatureSpy.mockRestore();
	});

	it("should render when wallet not found for votes", async () => {
		walletUrl = `/profiles/${profile.id()}/wallets/${blankWallet.id()}`;
		history.push(walletUrl);

		const { asFragment, getByTestId } = await renderPage();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to votes page when clicking on WalletVote button (vote)", async () => {
		walletUrl = `/profiles/${profile.id()}/wallets/${blankWallet.id()}`;
		history.push(walletUrl);

		const historySpy = jest.spyOn(history, "push");

		const { getByTestId, queryAllByTestId } = await renderPage();

		act(() => {
			fireEvent.click(getByTestId("WalletVote__button"));
		});

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${blankWallet.id()}/votes`);
	});

	it("should navigate to vote page when clicking on WalletVote button (unvote)", async () => {
		const historySpy = jest.spyOn(history, "push").mockReturnValue();

		const { getByTestId, queryAllByTestId } = await renderPage();

		act(() => {
			fireEvent.click(getByTestId("WalletVote__button"));
		});

		expect(historySpy).toHaveBeenCalledWith({
			pathname: `/profiles/${profile.id()}/wallets/${wallet.id()}/send-vote`,
			search: "?unvotes=D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
		});
		historySpy.mockRestore();
	});

	it("should navigate to new registration page when clicking on WalletRegistrations button (register)", async () => {
		walletUrl = `/profiles/${profile.id()}/wallets/${blankWallet.id()}`;
		history.push(walletUrl);

		const historySpy = jest.spyOn(history, "push");

		const { getByTestId, queryAllByTestId } = await renderPage();

		await waitFor(() => expect(queryAllByTestId("WalletRegistrations")).toHaveLength(1));

		act(() => {
			fireEvent.click(getByTestId("WalletRegistrations__button"));
		});

		expect(historySpy).toHaveBeenCalledWith(
			`/profiles/${profile.id()}/wallets/${blankWallet.id()}/send-entity-registration`,
		);
	});

	it("should navigate to registrations page when clicking on WalletRegistrations button (show all)", async () => {
		const historySpy = jest.spyOn(history, "push").mockReturnValue();
		const isMultiSignatureSpy = jest.spyOn(wallet, "isMultiSignature").mockImplementation(() => true);
		const { getByTestId, queryAllByTestId } = await renderPage();

		await waitFor(() => expect(queryAllByTestId("WalletRegistrations")).toHaveLength(1));

		act(() => {
			fireEvent.click(getByTestId("WalletRegistrations__button"));
		});

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/registrations`);
		isMultiSignatureSpy.mockRestore();
		historySpy.mockRestore();
	});

	it("should render when wallet hasn't voted", async () => {
		walletUrl = `/profiles/${profile.id()}/wallets/${unvotedWallet.id()}`;
		history.push(walletUrl);

		const { asFragment, getByTestId } = await renderPage();

		await waitFor(() => expect(getByTestId("WalletVote__empty")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update wallet name", async () => {
		const { getByTestId, getAllByTestId, asFragment } = await renderPage();
		await waitFor(() => expect(getAllByTestId("WalletVote")).toHaveLength(1));

		act(() => {
			fireEvent.click(getAllByTestId("dropdown__toggle")[2]);
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--primary-0"));
		});

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		const name = "Sample label name";

		act(() => {
			fireEvent.change(getByTestId("UpdateWalletName__input"), { target: { value: name } });
		});

		act(() => {
			fireEvent.click(getByTestId("UpdateWalletName__submit"));
		});

		await waitFor(() => expect(wallet.settings().get(WalletSetting.Alias)).toEqual(name));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should remove wallet name", async () => {
		const { getByTestId, getAllByTestId, asFragment } = await renderPage();
		await waitFor(() => expect(getAllByTestId("WalletVote")).toHaveLength(1));

		act(() => {
			fireEvent.click(getAllByTestId("dropdown__toggle")[2]);
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--primary-0"));
		});

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		act(() => {
			fireEvent.change(getByTestId("UpdateWalletName__input"), { target: { value: "" } });
		});

		const submitBtn = getByTestId("UpdateWalletName__submit");

		act(() => {
			fireEvent.click(getByTestId("UpdateWalletName__submit"));
		});

		await waitFor(() => expect(wallet.settings().get(WalletSetting.Alias)).toBe(undefined));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should star and unstar a wallet", async () => {
		const { getByTestId, getAllByTestId, asFragment } = await renderPage();
		await waitFor(() => expect(getAllByTestId("WalletVote")).toHaveLength(1));

		expect(wallet.isStarred()).toBe(false);

		act(() => {
			fireEvent.click(getByTestId("WalletHeader__star-button"));
		});

		await waitFor(() => expect(wallet.isStarred()).toBe(true));

		act(() => {
			fireEvent.click(getByTestId("WalletHeader__star-button"));
		});

		await waitFor(() => expect(wallet.isStarred()).toBe(false));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should open detail modal on transaction row click", async () => {
		const { asFragment, getByTestId } = await renderPage();

		act(() => {
			fireEvent.click(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")[0]);
		});

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should fetch more transactions", async () => {
		const { getByTestId, getAllByTestId } = await renderPage();

		await waitFor(() => expect(getAllByTestId("WalletVote")).toHaveLength(1));

		const fetchMoreTransactionsBtn = getByTestId("transactions__fetch-more-button");

		act(() => {
			fireEvent.click(fetchMoreTransactionsBtn);
		});

		await waitFor(() => {
			expect(within(getAllByTestId("TransactionTable")[0]).queryAllByTestId("TableRow")).toHaveLength(2);
		});
	});

	it("should filter by type", async () => {
		const { getByTestId } = await renderPage();

		act(() => {
			fireEvent.click(getByTestId("FilterTransactionsToggle"));
		});

		await waitFor(() => expect(getByTestId("dropdown__option--core-0")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--core-0"));
		});

		await waitFor(
			() => expect(within(getByTestId("TransactionTable")).queryAllByTestId("TableRow")).toHaveLength(0),
			{ timeout: 4000 },
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

		const deleteWalletOption = getByTestId("dropdown__option--secondary-0");
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

	it("should not render the bottom sheet menu when there is only one wallet", async () => {
		walletUrl = `/profiles/${emptyProfile.id()}/wallets/${wallet2.id()}`;
		history.push(walletUrl);

		const { asFragment, getByTestId, queryAllByTestId } = await renderPage();

		expect(queryAllByTestId("WalletBottomSheetMenu")).toHaveLength(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not fail if the votes have not yet been synchronized", async () => {
		const newWallet = await profile.wallets().importByMnemonic("test mnemonic", "ARK", "ark.devnet");
		nock("https://dwallets.ark.io").get(`/api/wallets/${newWallet.address()}`).reply(200, walletMock);

		await newWallet.syncIdentity();

		const syncVotesSpy = jest.spyOn(newWallet, "syncVotes").mockReturnValue();

		walletUrl = `/profiles/${profile.id()}/wallets/${newWallet.id()}`;
		history.push(walletUrl);

		const { asFragment } = await renderPage();

		expect(asFragment()).toMatchSnapshot();

		syncVotesSpy.mockRestore();
	});
});
