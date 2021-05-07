import { Contracts } from "@arkecosystem/platform-sdk-profiles";
// @README: This import is fine in tests but should be avoided in production code.
import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles/dist/drivers/memory/wallets/read-only-wallet";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { translations as walletTranslations } from "domains/wallet/i18n";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, syncDelegates, waitFor } from "utils/testing-library";

import { WalletVote } from "./WalletVote";

let wallet: Contracts.IReadWriteWallet;
let profile: Contracts.IProfile;

describe("WalletVote", () => {
	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		await syncDelegates(profile);
		await wallet.synchroniser().votes();
	});

	it("should render", async () => {
		const { asFragment, getByTestId } = render(
			<WalletVote profile={profile} wallet={wallet} onButtonClick={jest.fn()} env={env} />,
		);

		await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without votes", async () => {
		const walletSpy = jest.spyOn(wallet.voting(), "current").mockReturnValue([]);

		const { asFragment, getByText, getByTestId } = render(
			<WalletVote profile={profile} wallet={wallet} onButtonClick={jest.fn()} env={env} />,
		);

		await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
		expect(getByText(commonTranslations.LEARN_MORE)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		walletSpy.mockRestore();
	});

	it("should render disabled vote button", async () => {
		const balanceSpy = jest.spyOn(wallet, "balance").mockReturnValue(BigNumber.ZERO);

		const { asFragment, getByRole, getByTestId } = render(
			<WalletVote profile={profile} wallet={wallet} onButtonClick={jest.fn()} env={env} />,
		);

		await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
		expect(getByRole("button")).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();

		balanceSpy.mockRestore();
	});

	it("should handle wallet votes error", async () => {
		const walletSpy = jest.spyOn(wallet.voting(), "current").mockImplementation(() => {
			throw new Error("delegate error");
		});

		const { asFragment, getByText, getByTestId } = render(
			<WalletVote profile={profile} wallet={wallet} onButtonClick={jest.fn()} env={env} />,
		);

		await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
		expect(getByText(commonTranslations.LEARN_MORE)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		walletSpy.mockRestore();
	});

	it("should handle delegate sync error", async () => {
		const delegateSyncSpy = jest.spyOn(env.delegates(), "sync").mockImplementation(() => {
			throw new Error("delegate error");
		});
		const walletSpy = jest.spyOn(wallet.voting(), "current").mockReturnValue([]);

		const { asFragment, getByText, getByTestId } = render(
			<WalletVote profile={profile} wallet={wallet} onButtonClick={jest.fn()} env={env} />,
		);

		await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
		expect(getByText(commonTranslations.LEARN_MORE)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		delegateSyncSpy.mockRestore();
		walletSpy.mockRestore();
	});

	it("should render the maximum votes", async () => {
		const walletSpy = jest.spyOn(wallet.voting(), "current").mockReturnValue([]);
		const maxVotesSpy = jest.spyOn(wallet.network(), "maximumVotesPerWallet").mockReturnValue(101);

		const { asFragment, getByText, getByTestId } = render(
			<WalletVote profile={profile} wallet={wallet} onButtonClick={jest.fn()} env={env} />,
		);

		await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
		await waitFor(() => expect(getByText("0/101")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		walletSpy.mockRestore();
		maxVotesSpy.mockRestore();
	});

	describe("single vote networks", () => {
		it("should render a vote for an active delegate", async () => {
			const walletSpy = jest.spyOn(wallet.voting(), "current").mockReturnValue([
				new ReadOnlyWallet({
					address: wallet.address(),
					explorerLink: "",
					publicKey: wallet.publicKey(),
					username: "arkx",
					rank: 10,
				}),
			]);

			const { asFragment, getByText, getByTestId } = render(
				<WalletVote profile={profile} wallet={wallet} onButtonClick={jest.fn()} env={env} />,
			);

			const delegate = wallet.voting().current()[0];

			await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
			expect(getByText(delegate.username()!)).toBeTruthy();
			expect(getByText(`#${delegate.rank()}`)).toBeTruthy();
			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.ACTIVE)).toBeTruthy();

			expect(asFragment()).toMatchSnapshot();

			walletSpy.mockRestore();
		});

		it("should render a vote for a standby delegate", async () => {
			const walletSpy = jest.spyOn(wallet.voting(), "current").mockReturnValue([
				new ReadOnlyWallet({
					address: wallet.address(),
					explorerLink: "",
					publicKey: wallet.publicKey(),
					username: "arkx",
					rank: 52,
				}),
			]);

			const { asFragment, getByText, getByTestId } = render(
				<WalletVote profile={profile} wallet={wallet} onButtonClick={jest.fn()} env={env} />,
			);

			const delegate = wallet.voting().current()[0];

			await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
			expect(getByText(delegate.username()!)).toBeTruthy();
			expect(getByText(`#${delegate.rank()}`)).toBeTruthy();
			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.STANDBY)).toBeTruthy();

			expect(asFragment()).toMatchSnapshot();

			walletSpy.mockRestore();
		});

		it("should render a vote for a delegate without rank", async () => {
			const walletSpy = jest.spyOn(wallet.voting(), "current").mockReturnValue([
				new ReadOnlyWallet({
					address: wallet.address(),
					explorerLink: "",
					publicKey: wallet.publicKey(),
					username: "arkx",
				}),
			]);

			const { asFragment, getByText, getByTestId } = render(
				<WalletVote profile={profile} wallet={wallet} onButtonClick={jest.fn()} env={env} />,
			);

			const delegate = wallet.voting().current()[0];

			await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
			expect(getByText(delegate.username()!)).toBeTruthy();
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

		it("should render a vote for multiple active delegates", async () => {
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

			const { asFragment, getByText, getByTestId } = render(
				<WalletVote profile={profile} wallet={wallet} onButtonClick={jest.fn()} env={env} />,
			);

			await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.MULTIVOTE)).toBeTruthy();
			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.ACTIVE_plural)).toBeTruthy();

			expect(asFragment()).toMatchSnapshot();

			walletSpy.mockRestore();
		});

		it("should render a vote for multiple active delegates", async () => {
			const walletSpy = jest.spyOn(wallet.voting(), "current").mockReturnValue([
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

			const { asFragment, getByText, getByTestId } = render(
				<WalletVote profile={profile} wallet={wallet} onButtonClick={jest.fn()} env={env} />,
			);

			await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.MULTIVOTE)).toBeTruthy();
			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.STANDBY_plural)).toBeTruthy();

			expect(asFragment()).toMatchSnapshot();

			walletSpy.mockRestore();
		});

		it("should render a vote for multiple active and standby delegates", async () => {
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
				}),
			]);

			const { asFragment, getByText, getByTestId } = render(
				<WalletVote profile={profile} wallet={wallet} onButtonClick={jest.fn()} env={env} />,
			);

			await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
			expect(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.MULTIVOTE)).toBeTruthy();
			expect(getByText("Active 1")).toBeTruthy();
			expect(getByText("/ Standby 1")).toBeTruthy();

			expect(getByText("information-circle.svg")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();

			walletSpy.mockRestore();
		});
	});

	it("should emit action on multivote click", async () => {
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

		const onButtonClick = jest.fn();

		const { getByText, getByTestId } = render(
			<WalletVote profile={profile} wallet={wallet} onButtonClick={onButtonClick} env={env} />,
		);

		await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
		act(() => {
			fireEvent.click(getByText(walletTranslations.PAGE_WALLET_DETAILS.VOTES.MULTIVOTE));
		});

		expect(onButtonClick).toHaveBeenCalled();

		walletSpy.mockRestore();
	});

	it("should emit action on button click", async () => {
		await wallet.synchroniser().votes();
		await wallet.synchroniser().identity();
		await wallet.synchroniser().coin();
		const walletSpy = jest.spyOn(wallet.voting(), "current").mockReturnValue([]);

		const onButtonClick = jest.fn();

		const { getByText, getByTestId } = render(
			<WalletVote profile={profile} wallet={wallet} onButtonClick={onButtonClick} env={env} />,
		);

		await waitFor(() => expect(getByTestId("WalletVote")).toBeTruthy());
		await waitFor(() => expect(getByTestId("WalletVote")).not.toBeDisabled());

		act(() => {
			fireEvent.click(getByText(commonTranslations.VOTE));
		});

		expect(onButtonClick).toHaveBeenCalled();

		walletSpy.mockRestore();
	});
});
