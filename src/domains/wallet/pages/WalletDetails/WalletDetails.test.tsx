/* eslint-disable @typescript-eslint/require-await */
import { Enums } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
// @README: This import is fine in tests but should be avoided in production code.
import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles/distribution/read-only-wallet";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { toasts } from "app/services";
import { translations as walletTranslations } from "domains/wallet/i18n";
import electron from "electron";
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

jest.setTimeout(10_000);

const history = createMemoryHistory();
let walletUrl: string;

let profile: Contracts.IProfile;
let wallet: Contracts.IReadWriteWallet;
let blankWallet: Contracts.IReadWriteWallet;
let unvotedWallet: Contracts.IReadWriteWallet;

let emptyProfile: Contracts.IProfile;
let wallet2: Contracts.IReadWriteWallet;

const passphrase2 = "power return attend drink piece found tragic fire liar page disease combine";

const renderPage = async ({
	waitForTopSection = true,
	waitForTransactions = true,
	withProfileSynchronizer = false,
} = {}) => {
	const rendered: RenderResult = renderWithRouter(
		<Route path="/profiles/:profileId/wallets/:walletId">
			<WalletDetails />
		</Route>,
		{
			routes: [walletUrl],
			history,
			withProfileSynchronizer,
		},
	);

	const { getByTestId } = rendered;

	if (waitForTopSection) {
		await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
	}

	if (waitForTransactions) {
		await (withProfileSynchronizer
			? waitFor(() =>
					expect(within(getByTestId("TransactionTable")).queryAllByTestId("TableRow")).toHaveLength(1),
			  )
			: waitFor(() =>
					expect(within(getByTestId("TransactionTable")).queryAllByTestId("TableRow")).not.toHaveLength(0),
			  ));
	}

	return rendered;
};

describe("WalletDetails", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());

		await env.profiles().restore(profile);
		await profile.sync();

		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		blankWallet = await profile.walletFactory().fromMnemonicWithBIP39({
			mnemonic: passphrase2,
			coin: "ARK",
			network: "ark.devnet",
		});

		unvotedWallet = await profile.walletFactory().fromMnemonicWithBIP39({
			mnemonic: "unvoted wallet",
			coin: "ARK",
			network: "ark.devnet",
		});

		emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");

		wallet2 = await emptyProfile.walletFactory().fromMnemonicWithBIP39({
			mnemonic: "wallet 2",
			coin: "ARK",
			network: "ark.devnet",
		});

		profile.wallets().push(blankWallet);
		profile.wallets().push(unvotedWallet);
		emptyProfile.wallets().push(wallet2);

		await syncDelegates(profile);

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
			.query((parameters) => !!parameters.address)
			.reply(200, (url) => {
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

	it("should show network connection warning", async () => {
		const walletRestoreMock = jest.spyOn(wallet, "hasBeenPartiallyRestored").mockReturnValue(true);

		const warningMock = jest.fn();
		const toastSpy = jest.spyOn(toasts, "warning").mockImplementation(warningMock);

		await renderPage({ waitForTopSection: false });

		await waitFor(() => expect(toastSpy).toHaveBeenCalled());
		walletRestoreMock.mockRestore();
		toastSpy.mockRestore();
	});

	it("should not render wallet vote when the network does not support votes", async () => {
		const networkFeatureSpy = jest.spyOn(wallet.network(), "allowsVoting");

		when(networkFeatureSpy).calledWith(Enums.FeatureFlag.TransactionVote).mockReturnValue(false);

		const { getByTestId } = await renderPage({ waitForTopSection: false });

		await waitFor(() => {
			expect(() => getByTestId("WalletVote")).toThrow(/Unable to find an element by/);
		});

		networkFeatureSpy.mockRestore();
	});

	it("should render when wallet not found for votes", async () => {
		walletUrl = `/profiles/${profile.id()}/wallets/${blankWallet.id()}`;
		history.push(walletUrl);

		const { getByText } = await renderPage({ waitForTopSection: true, waitForTransactions: false });

		await waitFor(() => expect(getByText(commonTranslations.LEARN_MORE)).toBeTruthy());
	});

	it("should navigate to votes page when clicking on WalletVote button", async () => {
		await profile.sync();

		const walletSpy = jest.spyOn(wallet.voting(), "current").mockReturnValue([]);
		const historySpy = jest.spyOn(history, "push");

		const { getByTestId, getByText } = await renderPage();

		await waitFor(() => expect(getByText(commonTranslations.LEARN_MORE)).toBeTruthy());
		await waitFor(() => expect(getByTestId("WalletVote__button")).not.toBeDisabled());
		act(() => {
			fireEvent.click(getByTestId("WalletVote__button"));
		});

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}/votes`);

		walletSpy.mockRestore();
		historySpy.mockRestore();
	});

	it('should navigate to votes with "current" filter param when clicking on Multivote', async () => {
		const walletSpy = jest.spyOn(wallet.voting(), "current").mockReturnValue([
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

		const { getByText } = await renderPage();

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
		const { getByTestId, getAllByTestId } = await renderPage();

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

		await waitFor(() => expect(wallet.settings().get(Contracts.WalletSetting.Alias)).toEqual(name));
	});

	it("should remove wallet name", async () => {
		const { getByTestId, getAllByTestId } = await renderPage();

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

		getByTestId("UpdateWalletName__submit");

		act(() => {
			fireEvent.click(getByTestId("UpdateWalletName__submit"));
		});

		await waitFor(() => expect(wallet.settings().get(Contracts.WalletSetting.Alias)).toBe(undefined));
	});

	it("should star and unstar a wallet", async () => {
		const { getByTestId } = await renderPage();

		expect(wallet.isStarred()).toBe(false);

		act(() => {
			fireEvent.click(getByTestId("WalletHeader__star-button"));
		});

		await waitFor(() => expect(wallet.isStarred()).toBe(true));

		act(() => {
			fireEvent.click(getByTestId("WalletHeader__star-button"));
		});

		await waitFor(() => expect(wallet.isStarred()).toBe(false));
	});

	it("should open detail modal on transaction row click", async () => {
		const { getByTestId } = await renderPage({
			waitForTopSection: true,
			waitForTransactions: true,
			withProfileSynchronizer: true,
		});

		act(() => {
			fireEvent.click(within(getByTestId("TransactionTable")).getAllByTestId("TableRow")[0]);
		});

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow());
	});

	it("should fetch more transactions", async () => {
		const { getByTestId, getAllByTestId } = await renderPage({
			waitForTopSection: true,
			waitForTransactions: true,
			withProfileSynchronizer: true,
		});

		const fetchMoreTransactionsButton = getByTestId("transactions__fetch-more-button");

		act(() => {
			fireEvent.click(fetchMoreTransactionsButton);
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
			() => expect(within(getByTestId("TransactionTable")).queryAllByTestId("TableRow")).toHaveLength(8),
			{ timeout: 4000 },
		);
	});

	it("should open wallet in explorer", async () => {
		const ipcRendererMock = jest.spyOn(electron.ipcRenderer, "send").mockImplementation();
		const { getByTestId, getAllByTestId } = await renderPage();

		const dropdown = getAllByTestId("dropdown__toggle")[2];
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const openWalletOption = getByTestId("dropdown__option--secondary-0");
		expect(openWalletOption).toBeTruthy();

		act(() => {
			fireEvent.click(openWalletOption);
		});

		expect(ipcRendererMock).toHaveBeenCalledWith("open-external", wallet.explorerLink());
	});

	it("should manually sync wallet data", async () => {
		const { getByTestId } = await renderPage();

		act(() => {
			fireEvent.click(getByTestId("WalletHeader__refresh"));
		});

		expect(getByTestId("WalletHeader__refresh")).toHaveAttribute("aria-busy", "true");
		await waitFor(() => expect(getByTestId("WalletHeader__refresh")).toHaveAttribute("aria-busy", "false"));
	});

	it("should delete wallet", async () => {
		const { getByTestId, getAllByTestId } = await renderPage();

		const dropdown = getAllByTestId("dropdown__toggle")[2];
		expect(dropdown).toBeTruthy();

		act(() => {
			fireEvent.click(dropdown);
		});

		const deleteWalletOption = getByTestId("dropdown__option--secondary-1");
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
		const newWallet = await profile.walletFactory().fromMnemonicWithBIP39({
			mnemonic: "test mnemonic",
			coin: "ARK",
			network: "ark.devnet",
		});

		profile.wallets().push(newWallet);

		nock("https://dwallets.ark.io").get(`/api/wallets/${newWallet.address()}`).reply(200, walletMock);

		await newWallet.synchroniser().identity();

		const syncVotesSpy = jest.spyOn(newWallet.synchroniser(), "votes").mockReturnValue();

		walletUrl = `/profiles/${profile.id()}/wallets/${newWallet.id()}`;
		history.push(walletUrl);

		const { getByText } = await renderPage();

		await waitFor(() => expect(getByText(commonTranslations.LEARN_MORE)).toBeTruthy());

		syncVotesSpy.mockRestore();
	});
});
