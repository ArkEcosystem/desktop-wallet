/* eslint-disable @typescript-eslint/require-await */
import { Coins } from "@arkecosystem/platform-sdk";
import { Profile, ReadOnlyWallet, ReadWriteWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { useConfiguration } from "app/contexts";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { translations as walletTranslations } from "domains/wallet/i18n";
import { createMemoryHistory } from "history";
import { when } from "jest-when";
import nock from "nock";
import React, { useEffect } from "react";
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

jest.setTimeout(10000);

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

	const Page = () => {
		const { setConfiguration } = useConfiguration();

		useEffect(() => {
			setConfiguration({ profileIsSyncing: false });
		}, []);

		return <WalletDetails txSkeletonRowsLimit={1} transactionLimit={1} />;
	};

	await act(async () => {
		rendered = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<Page />
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);
	});

	const { getByTestId, queryAllByTestId } = rendered;

	if (waitForTopSection) {
		await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
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
				if (url === filteredUrl) {
					return { meta, data: [] };
				}

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

	it("should not render wallet vote when the network does not support votes", async () => {
		const networkFeatureSpy = jest.spyOn(wallet.network(), "can");

		when(networkFeatureSpy).calledWith(Coins.FeatureFlag.TransactionVote).mockReturnValue(false);

		const { getByTestId } = await renderPage(false);

		await waitFor(() => {
			expect(() => getByTestId("WalletVote")).toThrow(/Unable to find an element by/);
		});

		networkFeatureSpy.mockRestore();
	});

	it("should render when wallet not found for votes", async () => {
		walletUrl = `/profiles/${profile.id()}/wallets/${blankWallet.id()}`;
		history.push(walletUrl);

		const { asFragment, getByText } = await renderPage();

		await waitFor(() => expect(getByText(commonTranslations.LEARN_MORE)).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to votes page when clicking on WalletVote button", async () => {
		const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue([]);
		const historySpy = jest.spyOn(history, "push");

		const { getByTestId, getByText, queryAllByTestId } = await renderPage();

		await waitFor(() => expect(getByText(commonTranslations.LEARN_MORE)).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("WalletVote__button"));
		});

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}/votes`);

		walletSpy.mockRestore();
		historySpy.mockRestore();
	});

	it('should navigate to votes with "current" filter param when clicking on Multivote', async () => {
		const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue([
			new ReadOnlyWallet({
				address: wallet.address(),
				explorerLink: "",
				publicKey: wallet.publicKey(),
				username: "arkx",
				rank: 1,
			}),
			new ReadOnlyWallet({
				address: wallet.address(),
				explorerLink: "",
				publicKey: wallet.publicKey(),
				username: "arky",
				rank: 2,
			}),
		]);
		const maxVotesSpy = jest.spyOn(wallet.network(), "maximumVotesPerWallet").mockReturnValue(101);
		const historySpy = jest.spyOn(history, "push");

		const { getByText, queryAllByTestId } = await renderPage();

		act(() => {
			fireEvent.click(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.MULTIVOTE));
		});

		expect(historySpy).toHaveBeenCalledWith({
			pathname: `/profiles/${profile.id()}/wallets/${wallet.id()}/votes`,
			search: "?filter=current",
		});

		walletSpy.mockRestore();
		maxVotesSpy.mockRestore();
		historySpy.mockRestore();
	});

	it("should update wallet name", async () => {
		const { getByTestId, getAllByTestId, asFragment } = await renderPage();

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

		const fetchMoreTransactionsBtn = getByTestId("transactions__fetch-more-button");

		act(() => {
			fireEvent.click(fetchMoreTransactionsBtn);
		});

		await waitFor(() => {
			expect(within(getAllByTestId("TransactionTable")[0]).queryAllByTestId("TableRow")).toHaveLength(2);
		});
	});

	it("should filter by type", async () => {
		const { getByRole, getByTestId } = await renderPage();

		act(() => {
			fireEvent.click(getByRole("button", { name: /Type/ }));
		});

		await waitFor(() => expect(getByTestId("dropdown__option--core-0")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--core-0"));
		});

		await waitFor(
			() => expect(within(getByTestId("TransactionTable")).queryAllByTestId("TableRow")).toHaveLength(1),
			{ timeout: 4000 },
		);
	});

	it("should delete wallet", async () => {
		const { getByTestId, getAllByTestId } = await renderPage();

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

	it("should not fail if the votes have not yet been synchronized", async () => {
		const newWallet = await profile.wallets().importByMnemonic("test mnemonic", "ARK", "ark.devnet");
		nock("https://dwallets.ark.io").get(`/api/wallets/${newWallet.address()}`).reply(200, walletMock);

		await newWallet.syncIdentity();

		const syncVotesSpy = jest.spyOn(newWallet, "syncVotes").mockReturnValue();

		walletUrl = `/profiles/${profile.id()}/wallets/${newWallet.id()}`;
		history.push(walletUrl);

		const { asFragment, getByText } = await renderPage();

		await waitFor(() => expect(getByText(commonTranslations.LEARN_MORE)).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();

		syncVotesSpy.mockRestore();
	});
});
