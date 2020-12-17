import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, syncDelegates } from "testing-library";

import { WalletVote } from "./WalletVote";

const history = createMemoryHistory();

let wallet: ReadWriteWallet;
let votes: ReadOnlyWallet[];

let walletURL: string;

describe("WalletVote", () => {
	beforeEach(async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		await syncDelegates();
		await wallet.syncVotes();

		walletURL = `/profiles/${profile.id()}/wallets/${wallet.id()}`;
		history.push(walletURL);
	});

	it("should render", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletVote onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByTestId("WalletVote")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render loading state", () => {
		const walletSpy = jest.spyOn(wallet, "hasSyncedWithNetwork").mockReturnValue(false);

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletVote onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByTestId("WalletVote__skeleton")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		walletSpy.mockRestore();
	});

	it("should render without votes", () => {
		const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue([]);

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletVote onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByTestId("WalletVote__empty")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		walletSpy.mockRestore();
	});

	it("should render the maximum votes", () => {
		jest.spyOn(wallet, "votes").mockReturnValue([]);
		jest.spyOn(wallet.network(), "maximumVotesPerWallet").mockReturnValue(101);

		const { asFragment, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletVote onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByText("(0/101)")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		jest.clearAllMocks();
	});

	it("should render a single vote", () => {
		const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue([
			new ReadOnlyWallet({
				address: wallet.address(),
				explorerLink: "",
				publicKey: wallet.publicKey(),
				username: "arkx",
				rank: 1,
			}),
		]);

		const { asFragment, getAllByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletVote onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		expect(getByText("status-ok.svg")).toBeTruthy();
		expect(getAllByTestId("Avatar")).toHaveLength(1);
		expect(getByText(wallet.votes()[0].username())).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		walletSpy.mockRestore();
	});

	it.each([2, 3, 4])("should render multiple votes (%s)", (count) => {
		const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue(
			new Array(count).fill(
				new ReadOnlyWallet({
					address: wallet.address(),
					explorerLink: "",
					publicKey: wallet.publicKey(),
					username: "arkx",
					rank: 1,
				}),
			),
		);

		const { asFragment, getAllByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletVote onButtonClick={jest.fn()} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		if (count < 4) {
			expect(getAllByTestId("Avatar")).toHaveLength(count);
		} else {
			expect(getByText("+2")).toBeTruthy();
		}

		expect(() => getByText(wallet.votes()[0].username())).toThrow(/Unable to find an element/);
		expect(asFragment()).toMatchSnapshot();

		walletSpy.mockRestore();
	});

	it("should emit action on button (vote)", () => {
		const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue([]);

		const onButtonClick = jest.fn();

		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletVote onButtonClick={onButtonClick} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		act(() => {
			fireEvent.click(getByText(commonTranslations.VOTE));
		});

		expect(onButtonClick).toHaveBeenCalled();

		walletSpy.mockRestore();
	});

	it("should emit action on button (unvote)", () => {
		const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue([
			new ReadOnlyWallet({
				address: wallet.address(),
				explorerLink: "",
				publicKey: wallet.publicKey(),
				username: "arkx",
				rank: 1,
			}),
		]);

		const onButtonClick = jest.fn();

		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletVote onButtonClick={onButtonClick} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		act(() => {
			fireEvent.click(getByText(commonTranslations.UNVOTE));
		});

		expect(onButtonClick).toHaveBeenCalledWith(wallet.votes()[0].address());

		walletSpy.mockRestore();
	});

	it("should emit action on button (show all)", () => {
		const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue(
			new Array(5).fill(
				new ReadOnlyWallet({
					address: wallet.address(),
					explorerLink: "",
					publicKey: wallet.publicKey(),
					username: "arkx",
					rank: 1,
				}),
			),
		);

		const onButtonClick = jest.fn();

		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<WalletVote onButtonClick={onButtonClick} />
			</Route>,
			{
				routes: [walletURL],
				history,
			},
		);

		act(() => {
			fireEvent.click(getByText(commonTranslations.SHOW_ALL));
		});

		expect(onButtonClick).toHaveBeenCalled();

		walletSpy.mockRestore();
	});
});
