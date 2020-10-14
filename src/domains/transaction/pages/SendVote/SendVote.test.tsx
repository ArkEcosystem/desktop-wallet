/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { act, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import {
	env,
	fireEvent,
	getDefaultProfileId,
	RenderResult,
	renderWithRouter,
	syncDelegates,
	syncFees,
	waitFor,
	within,
} from "testing-library";
import { data as delegateData } from "tests/fixtures/coins/ark/delegates-devnet.json";
import unvoteFixture from "tests/fixtures/coins/ark/transactions/unvote.json";
import voteFixture from "tests/fixtures/coins/ark/transactions/vote.json";

import { translations as transactionTranslations } from "../../i18n";
import { SendVote } from "../SendVote";

const fixtureProfileId = getDefaultProfileId();

const createVoteTransactionMock = (wallet: ReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		id: () => voteFixture.data.id,
		sender: () => voteFixture.data.sender,
		recipient: () => voteFixture.data.recipient,
		amount: () => BigNumber.make(voteFixture.data.amount),
		fee: () => BigNumber.make(voteFixture.data.fee),
		data: () => voteFixture.data,
	});

const createUnvoteTransactionMock = (wallet: ReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		id: () => unvoteFixture.data.id,
		sender: () => unvoteFixture.data.sender,
		recipient: () => unvoteFixture.data.recipient,
		amount: () => BigNumber.make(unvoteFixture.data.amount),
		fee: () => BigNumber.make(unvoteFixture.data.fee),
		data: () => unvoteFixture.data,
	});

let profile: Profile;
let wallet: ReadWriteWallet;
let votes: ReadOnlyWallet[];

describe("SendVote", () => {
	beforeAll(async () => {
		jest.useFakeTimers();

		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		jest.spyOn(wallet, "isDelegate").mockImplementation(() => true);

		await syncDelegates();
		await syncFees();

		votes = [0, 1].map((index) =>
			env.delegates().findByAddress(wallet.coinId(), wallet.networkId(), delegateData[index].address),
		);

		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/transactions/d819c5199e323a62a4349948ff075edde91e509028329f66ec76b8518ad1e493")
			.reply(200, voteFixture)
			.get("/api/transactions/32e5278cb72f24f2c04c4797dbfbffa7072f6a30e016093fdd3f7660a2ee2faf")
			.reply(200, unvoteFixture)
			.persist();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it("should send a unvote & vote transaction", async () => {
		const votesMock = jest.spyOn(wallet, "votes").mockImplementation(() => [
			new ReadOnlyWallet({
				address: delegateData[1].address,
				explorerLink: "",
				publicKey: delegateData[1].publicKey,
				username: delegateData[1].username,
				rank: delegateData[1].rank,
			}),
		]);
		await wallet.syncVotes();

		const history = createMemoryHistory();
		const voteURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-vote`;

		const params = new URLSearchParams({
			unvotes: delegateData[1].address,
			votes: delegateData[0].address,
		});

		history.push({
			pathname: voteURL,
			search: `?${params}`,
		});

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
					<SendVote />
				</Route>,
				{
					routes: [voteURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendVote__step--first")).toBeTruthy());
			await waitFor(() =>
				expect(rendered.getByTestId("SendVote__step--first")).toHaveTextContent(delegateData[0].username),
			);
		});

		const { getByTestId } = rendered!;

		await act(async () => {
			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			fireEvent.click(getByTestId("SendVote__button--continue"));
			await waitFor(() => expect(getByTestId("SendVote__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVote__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("SendVote__button--back"));
			await waitFor(() => expect(getByTestId("SendVote__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVote__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
			const passwordInput = getByTestId("AuthenticationStep__mnemonic");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			const signUnvoteMock = jest
				.spyOn(wallet.transaction(), "signVote")
				.mockReturnValue(Promise.resolve(unvoteFixture.data.id));
			const broadcastUnvoteMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionUnvoteMock = createVoteTransactionMock(wallet);

			const signVoteMock = jest
				.spyOn(wallet.transaction(), "signVote")
				.mockReturnValue(Promise.resolve(voteFixture.data.id));
			const broadcastVoteMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionVoteMock = createVoteTransactionMock(wallet);

			fireEvent.click(getByTestId("SendVote__button--submit"));

			setTimeout(() => {
				votesMock.mockRestore();
			}, 3000);

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy(), { timeout: 2000 });

			await waitFor(() => expect(setInterval).toHaveBeenCalledTimes(2));

			jest.runOnlyPendingTimers();

			signUnvoteMock.mockRestore();
			broadcastUnvoteMock.mockRestore();
			transactionUnvoteMock.mockRestore();

			signVoteMock.mockRestore();
			broadcastVoteMock.mockRestore();
			transactionVoteMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());

			// Go back to wallet
			const historySpy = jest.spyOn(history, "push");
			fireEvent.click(getByTestId("SendVote__button--back-to-wallet"));
			expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);
			historySpy.mockRestore();
		});
	});

	it("should send a vote transaction", async () => {
		const history = createMemoryHistory();
		const voteURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-vote`;

		const params = new URLSearchParams({
			votes: delegateData[0].address,
		});

		history.push({
			pathname: voteURL,
			search: `?${params}`,
		});

		let rendered: RenderResult;

		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					fee: (0.1 * 1e8).toFixed(0),
				},
			}),
		);

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
					<FormProvider {...form.current}>
						<SendVote />
					</FormProvider>
				</Route>,
				{
					routes: [voteURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendVote__step--first")).toBeTruthy());
			await waitFor(() =>
				expect(rendered.getByTestId("SendVote__step--first")).toHaveTextContent(delegateData[0].username),
			);
		});

		const { getByTestId } = rendered!;

		await act(async () => {
			// Step 2
			fireEvent.click(getByTestId("SendVote__button--continue"));
			await waitFor(() => expect(getByTestId("SendVote__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVote__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("SendVote__button--back"));
			await waitFor(() => expect(getByTestId("SendVote__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVote__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
			const passwordInput = getByTestId("AuthenticationStep__mnemonic");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			const signMock = jest
				.spyOn(wallet.transaction(), "signVote")
				.mockReturnValue(Promise.resolve(voteFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createVoteTransactionMock(wallet);

			fireEvent.click(getByTestId("SendVote__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});

	it("should send a unvote transaction", async () => {
		const history = createMemoryHistory();
		const voteURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-vote`;

		const params = new URLSearchParams({
			unvotes: delegateData[1].address,
		});

		history.push({
			pathname: voteURL,
			search: `?${params}`,
		});

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
					<SendVote />
				</Route>,
				{
					routes: [voteURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendVote__step--first")).toBeTruthy());
			await waitFor(() =>
				expect(rendered.getByTestId("SendVote__step--first")).toHaveTextContent(delegateData[1].username),
			);
		});

		const { getByTestId } = rendered!;

		await act(async () => {
			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			fireEvent.click(getByTestId("SendVote__button--continue"));
			await waitFor(() => expect(getByTestId("SendVote__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVote__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("SendVote__button--back"));
			await waitFor(() => expect(getByTestId("SendVote__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVote__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
			const passwordInput = getByTestId("AuthenticationStep__mnemonic");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			const signMock = jest
				.spyOn(wallet.transaction(), "signVote")
				.mockReturnValue(Promise.resolve(unvoteFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createUnvoteTransactionMock(wallet);

			fireEvent.click(getByTestId("SendVote__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});

	it("should show error if wrong mnemonic", async () => {
		const history = createMemoryHistory();
		const voteURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-vote`;

		const params = new URLSearchParams({
			votes: delegateData[0].address,
		});

		history.push({
			pathname: voteURL,
			search: `?${params}`,
		});

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
					<SendVote />
				</Route>,
				{
					routes: [voteURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendVote__step--first")).toBeTruthy());
			await waitFor(() =>
				expect(rendered.getByTestId("SendVote__step--first")).toHaveTextContent(delegateData[0].username),
			);
		});

		const { getByTestId } = rendered!;

		await act(async () => {
			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			fireEvent.click(getByTestId("SendVote__button--continue"));
			await waitFor(() => expect(getByTestId("SendVote__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVote__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("SendVote__button--back"));
			await waitFor(() => expect(getByTestId("SendVote__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVote__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
			const passwordInput = getByTestId("AuthenticationStep__mnemonic");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			const signMock = jest.spyOn(wallet.transaction(), "signVote").mockImplementation(() => {
				throw new Error();
			});

			const consoleSpy = jest.spyOn(console, "error").mockImplementation();

			fireEvent.click(getByTestId("SendVote__button--submit"));

			await waitFor(() => expect(consoleSpy).toHaveBeenCalledTimes(1));
			await waitFor(() => expect(passwordInput).toHaveValue(""));
			await waitFor(() =>
				expect(getByTestId("AuthenticationStep")).toHaveTextContent(transactionTranslations.INVALID_MNEMONIC),
			);

			signMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});
});
