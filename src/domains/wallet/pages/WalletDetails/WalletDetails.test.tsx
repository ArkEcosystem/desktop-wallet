/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
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

const renderPage = async () => {
	const rendered = renderWithRouter(
		<Route path="/profiles/:profileId/wallets/:walletId">
			<WalletDetails txSkeletonRowsLimit={1} />
		</Route>,
		{
			routes: [walletUrl],
			history,
		},
	);

	const { getAllByTestId } = rendered;

	await waitFor(() =>
		expect(within(getAllByTestId("TransactionTable")[1]).queryAllByTestId("TableRow")).toHaveLength(1),
	);

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
			.reply(200, require("tests/fixtures/coins/ark/delegates.json"))
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
			.post("/api/transactions/search")
			.query(true)
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/transactions.json");
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
	});

	it("should render", async () => {
		const { getByTestId, queryAllByTestId, asFragment } = await renderPage();

		await waitFor(() => expect(queryAllByTestId("WalletVote")).toHaveLength(1));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render when wallet not found for votes", async () => {
		walletUrl = `/profiles/${profile.id()}/wallets/${blankWallet.id()}`;
		history.push(walletUrl);

		const { asFragment, getByTestId } = await renderPage();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to vote page when clicking on WalletVote button (unvote)", async () => {
		const historySpy = jest.spyOn(history, "push");

		const { getByTestId, queryAllByTestId } = await renderPage();

		await waitFor(() => expect(queryAllByTestId("WalletVote")).toHaveLength(1));

		act(() => {
			fireEvent.click(getByTestId("WalletVote__button"));
		});

		expect(historySpy).toHaveBeenCalledWith({
			pathname: `/profiles/${profile.id()}/wallets/${wallet.id()}/send-vote`,
			search: `?unvotes=${wallet.votes()[0].address()}`,
		});
	});

	it("should navigate to registrations page when clicking on WalletRegistrations button", async () => {
		const historySpy = jest.spyOn(history, "push");

		const { getByTestId, queryAllByTestId } = await renderPage();

		await waitFor(() => expect(queryAllByTestId("WalletRegistrations")).toHaveLength(1));

		act(() => {
			fireEvent.click(getByTestId("WalletRegistrations__button"));
		});

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/registrations`);
	});

	it("should render when wallet hasn't voted", async () => {
		walletUrl = `/profiles/${profile.id()}/wallets/${unvotedWallet.id()}`;
		history.push(walletUrl);

		const { asFragment, getByTestId } = await renderPage();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should update wallet name", async () => {
		const { getByTestId, getAllByTestId, asFragment } = await renderPage();
		await waitFor(() => expect(getAllByTestId("WalletVote")).toHaveLength(1));

		act(() => {
			fireEvent.click(getAllByTestId("dropdown__toggle")[2]);
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--0"));
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
			fireEvent.click(getByTestId("dropdown__option--0"));
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

		await waitFor(() => {
			expect(within(getAllByTestId("TransactionTable")[1]).queryAllByTestId("TableRow")).toHaveLength(3);
		});
	});

	it("should render with timers", async () => {
		jest.useFakeTimers();

		const { asFragment, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletDetails txSkeletonRowsLimit={1} />
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);

		await act(async () => {
			jest.advanceTimersByTime(30000);
		});

		await waitFor(() => expect(getAllByTestId("WalletVote")).toHaveLength(1));
		expect(asFragment()).toMatchSnapshot();
		jest.useRealTimers();
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

	it("should not render the bottom sheet menu when there is only one wallet", async () => {
		walletUrl = `/profiles/${emptyProfile.id()}/wallets/${wallet2.id()}`;
		history.push(walletUrl);

		const { asFragment, getByTestId, queryAllByTestId } = await renderPage();

		expect(queryAllByTestId("WalletBottomSheetMenu")).toHaveLength(0);
		expect(asFragment()).toMatchSnapshot();
	});
});
