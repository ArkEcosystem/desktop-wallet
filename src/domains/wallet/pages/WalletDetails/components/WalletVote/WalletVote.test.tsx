import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { translations as walletTranslations } from "domains/wallet/i18n";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, syncDelegates } from "utils/testing-library";

import { WalletVote } from "./WalletVote";

let wallet: ReadWriteWallet;

describe("WalletVote", () => {
	beforeEach(async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		await syncDelegates();
		await wallet.syncVotes();
	});

	it("should render", () => {
		const { asFragment, getByTestId } = render(<WalletVote wallet={wallet} onButtonClick={jest.fn()} />);

		expect(getByTestId("WalletVote")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render loading state", () => {
		const { asFragment, getByTestId } = render(<WalletVote wallet={wallet} onButtonClick={jest.fn()} isLoading />);

		expect(getByTestId("WalletVote__skeleton")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without votes", () => {
		const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue([]);

		const { asFragment, getByText } = render(<WalletVote wallet={wallet} onButtonClick={jest.fn()} />);

		expect(getByText(commonTranslations.LEARN_MORE)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		walletSpy.mockRestore();
	});

	it("should render the maximum votes", () => {
		const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue([]);
		const maxVotesSpy = jest.spyOn(wallet.network(), "maximumVotesPerWallet").mockReturnValue(101);

		const { asFragment, getByText } = render(<WalletVote wallet={wallet} onButtonClick={jest.fn()} />);

		expect(getByText("0/101")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		walletSpy.mockRestore();
		maxVotesSpy.mockRestore();
	});

	describe("single vote networks", () => {
		it("should render a vote for an active delegate", () => {
			const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue([
				new ReadOnlyWallet({
					address: wallet.address(),
					explorerLink: "",
					publicKey: wallet.publicKey(),
					username: "arkx",
					rank: 10,
				}),
			]);

			const { asFragment, getByText } = render(<WalletVote wallet={wallet} onButtonClick={jest.fn()} />);

			const delegate = wallet.votes()[0];

			expect(getByText(delegate.username())).toBeTruthy();
			expect(getByText(`#${delegate.rank()}`)).toBeTruthy();
			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.ACTIVE)).toBeTruthy();

			expect(asFragment()).toMatchSnapshot();

			walletSpy.mockRestore();
		});

		it("should render a vote for a standby delegate", () => {
			const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue([
				new ReadOnlyWallet({
					address: wallet.address(),
					explorerLink: "",
					publicKey: wallet.publicKey(),
					username: "arkx",
					rank: 52,
				}),
			]);

			const { asFragment, getByText } = render(<WalletVote wallet={wallet} onButtonClick={jest.fn()} />);

			const delegate = wallet.votes()[0];

			expect(getByText(delegate.username())).toBeTruthy();
			expect(getByText(`#${delegate.rank()}`)).toBeTruthy();
			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.STANDBY)).toBeTruthy();

			expect(asFragment()).toMatchSnapshot();

			walletSpy.mockRestore();
		});

		it("should render a vote for a delegate without rank", () => {
			const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue([
				new ReadOnlyWallet({
					address: wallet.address(),
					explorerLink: "",
					publicKey: wallet.publicKey(),
					username: "arkx",
				}),
			]);

			const { asFragment, getByText } = render(<WalletVote wallet={wallet} onButtonClick={jest.fn()} />);

			const delegate = wallet.votes()[0];

			expect(getByText(delegate.username())).toBeTruthy();
			expect(getByText(commonTranslations.NOT_AVAILABLE)).toBeTruthy();
			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.STANDBY)).toBeTruthy();

			expect(getByText("information-circle.svg")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();

			walletSpy.mockRestore();
		});
	});

	describe("multi vote networks", () => {
		let maxVotesSpy: jest.SpyInstance;

		beforeEach(() => (maxVotesSpy = jest.spyOn(wallet.network(), "maximumVotesPerWallet").mockReturnValue(101)));

		afterEach(() => maxVotesSpy.mockRestore());

		it("should render a vote for multiple active delegates", () => {
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

			const { asFragment, getByText } = render(<WalletVote wallet={wallet} onButtonClick={jest.fn()} />);

			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.MULTIVOTE)).toBeTruthy();
			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.ACTIVE_plural)).toBeTruthy();

			expect(asFragment()).toMatchSnapshot();

			walletSpy.mockRestore();
		});

		it("should render a vote for multiple active delegates", () => {
			const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue([
				new ReadOnlyWallet({
					address: wallet.address(),
					explorerLink: "",
					publicKey: wallet.publicKey(),
					username: "arkx",
				}),
				new ReadOnlyWallet({
					address: wallet.address(),
					explorerLink: "",
					publicKey: wallet.publicKey(),
					username: "arky",
				}),
			]);

			const { asFragment, getByText } = render(<WalletVote wallet={wallet} onButtonClick={jest.fn()} />);

			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.MULTIVOTE)).toBeTruthy();
			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.STANDBY_plural)).toBeTruthy();

			expect(asFragment()).toMatchSnapshot();

			walletSpy.mockRestore();
		});

		it("should render a vote for multiple active and standby delegates", () => {
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
				}),
			]);

			const { asFragment, getByText } = render(<WalletVote wallet={wallet} onButtonClick={jest.fn()} />);

			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.MULTIVOTE)).toBeTruthy();
			expect(getByText("Active 1")).toBeTruthy();
			expect(getByText("/ Standby 1")).toBeTruthy();

			expect(getByText("information-circle.svg")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();

			walletSpy.mockRestore();
		});
	});

	it("should emit action on multivote click", () => {
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

		const onButtonClick = jest.fn();

		const { getByText } = render(<WalletVote wallet={wallet} onButtonClick={onButtonClick} />);

		act(() => {
			fireEvent.click(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.MULTIVOTE));
		});

		expect(onButtonClick).toHaveBeenCalled();

		walletSpy.mockRestore();
	});

	it("should emit action on button click", () => {
		const walletSpy = jest.spyOn(wallet, "votes").mockReturnValue([]);

		const onButtonClick = jest.fn();

		const { getByText } = render(<WalletVote wallet={wallet} onButtonClick={onButtonClick} />);

		act(() => {
			fireEvent.click(getByText(commonTranslations.VOTE));
		});

		expect(onButtonClick).toHaveBeenCalled();

		walletSpy.mockRestore();
	});
});
