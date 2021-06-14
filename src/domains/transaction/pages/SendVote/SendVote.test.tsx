/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
// @README: This import is fine in tests but should be avoided in production code.
import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles/distribution/drivers/memory/wallets/read-only-wallet";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { renderHook } from "@testing-library/react-hooks";
import { LedgerProvider } from "app/contexts";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import { data as delegateData } from "tests/fixtures/coins/ark/devnet/delegates.json";
import unvoteFixture from "tests/fixtures/coins/ark/devnet/transactions/unvote.json";
import voteFixture from "tests/fixtures/coins/ark/devnet/transactions/vote.json";
import {
	act,
	env,
	fireEvent,
	getDefaultLedgerTransport,
	getDefaultProfileId,
	getDefaultWalletId,
	getDefaultWalletMnemonic,
	renderWithRouter,
	syncDelegates,
	syncFees,
	waitFor,
} from "utils/testing-library";

import { SendVote } from "../SendVote";

const fixtureProfileId = getDefaultProfileId();

const createVoteTransactionMock = (wallet: Contracts.IReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		id: () => voteFixture.data.id,
		sender: () => voteFixture.data.sender,
		recipient: () => voteFixture.data.recipient,
		amount: () => BigNumber.make(voteFixture.data.amount),
		fee: () => BigNumber.make(voteFixture.data.fee),
		data: () => voteFixture.data,
	});

const createUnvoteTransactionMock = (wallet: Contracts.IReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		id: () => unvoteFixture.data.id,
		sender: () => unvoteFixture.data.sender,
		recipient: () => unvoteFixture.data.recipient,
		amount: () => BigNumber.make(unvoteFixture.data.amount),
		fee: () => BigNumber.make(unvoteFixture.data.fee),
		data: () => unvoteFixture.data,
	});

const passphrase = getDefaultWalletMnemonic();
let profile: Contracts.IProfile;
let wallet: Contracts.IReadWriteWallet;
let votes: ReadOnlyWallet[];
const transport = getDefaultLedgerTransport();

describe("SendVote", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());

		await env.profiles().restore(profile);
		await profile.sync();

		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		await wallet.synchroniser().identity();

		jest.spyOn(wallet, "isDelegate").mockImplementation(() => true);

		await syncDelegates(profile);
		await syncFees(profile);

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

	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("should return to the select a delegate page to vote", async () => {
		const history = createMemoryHistory();
		const voteURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-vote`;

		const params = new URLSearchParams({
			votes: delegateData[0].address,
		});

		history.push({
			pathname: voteURL,
			search: `?${params}`,
		});

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<LedgerProvider transport={transport}>
					<SendVote />
				</LedgerProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[0].username));

		// Back to select a delegate page
		await waitFor(() => expect(getByTestId("SendVote__button--back")).not.toBeDisabled());

		act(() => {
			fireEvent.click(getByTestId("SendVote__button--back"));
		});

		expect(container).toMatchSnapshot();
	});

	it("should return to the select a delegate page to unvote", async () => {
		const history = createMemoryHistory();
		const voteURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-vote`;

		const params = new URLSearchParams({
			unvotes: delegateData[1].address,
		});

		history.push({
			pathname: voteURL,
			search: `?${params}`,
		});

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<LedgerProvider transport={transport}>
					<SendVote />
				</LedgerProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[1].username));

		// Back to select a delegate page
		await waitFor(() => expect(getByTestId("SendVote__button--back")).not.toBeDisabled());

		act(() => {
			fireEvent.click(getByTestId("SendVote__button--back"));
		});

		expect(container).toMatchSnapshot();
	});

	it("should return to the select a delegate page to unvote/vote", async () => {
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

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<LedgerProvider transport={transport}>
					<SendVote />
				</LedgerProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[0].username));

		// Back to select a delegate page
		await waitFor(() => expect(getByTestId("SendVote__button--back")).not.toBeDisabled());

		act(() => {
			fireEvent.click(getByTestId("SendVote__button--back"));
		});

		expect(container).toMatchSnapshot();
	});

	it("should send a unvote & vote transaction", async () => {
		const votesMock = jest.spyOn(wallet.voting(), "current").mockImplementation(() => [
			new ReadOnlyWallet({
				address: delegateData[1].address,
				explorerLink: "",
				publicKey: delegateData[1].publicKey,
				username: delegateData[1].username,
				rank: delegateData[1].rank,
			}),
		]);
		await wallet.synchroniser().votes();

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

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<LedgerProvider transport={transport}>
					<SendVote />
				</LedgerProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[0].username));

		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

		await waitFor(() => expect(getByTestId("SendVote__button--continue")).not.toBeDisabled());
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Review Step
		expect(getByTestId("SendVote__review-step")).toBeTruthy();
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// AuthenticationStep
		expect(getByTestId("AuthenticationStep")).toBeTruthy();

		const signUnvoteMock = jest
			.spyOn(wallet.transaction(), "signVote")
			.mockReturnValue(Promise.resolve(unvoteFixture.data.id));
		const broadcastUnvoteMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [unvoteFixture.data.id],
			rejected: [],
			errors: {},
		});
		const transactionUnvoteMock = createVoteTransactionMock(wallet);

		const signVoteMock = jest
			.spyOn(wallet.transaction(), "signVote")
			.mockReturnValue(Promise.resolve(voteFixture.data.id));
		const broadcastVoteMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [voteFixture.data.id],
			rejected: [],
			errors: {},
		});
		const transactionVoteMock = createVoteTransactionMock(wallet);

		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		fireEvent.input(passwordInput, { target: { value: passphrase } });
		expect(passwordInput).toHaveValue(passphrase);

		await waitFor(() => expect(getByTestId("SendVote__button--submit")).not.toBeDisabled());

		await act(async () => {
			fireEvent.click(getByTestId("SendVote__button--submit"));
		});

		act(() => jest.advanceTimersByTime(1000));

		setTimeout(() => {
			votesMock.mockRestore();
		}, 3000);

		act(() => jest.runOnlyPendingTimers());

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy(), { timeout: 4000 });
		await waitFor(() => expect(setInterval).toHaveBeenCalledTimes(1));

		const historySpy = jest.spyOn(history, "push");

		// Go back to wallet
		act(() => {
			fireEvent.click(getByTestId("SendVote__button--back-to-wallet"));
		});

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);

		historySpy.mockRestore();

		signUnvoteMock.mockRestore();
		broadcastUnvoteMock.mockRestore();
		transactionUnvoteMock.mockRestore();

		signVoteMock.mockRestore();
		broadcastVoteMock.mockRestore();
		transactionVoteMock.mockRestore();
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

		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					fee: "0.1",
				},
			}),
		);

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<FormProvider {...form.current}>
					<LedgerProvider transport={transport}>
						<SendVote />
					</LedgerProvider>
				</FormProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[0].username));

		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

		await waitFor(() => expect(getByTestId("SendVote__button--continue")).not.toBeDisabled());
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Review Step
		expect(getByTestId("SendVote__review-step")).toBeTruthy();
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// AuthenticationStep
		expect(getByTestId("AuthenticationStep")).toBeTruthy();

		const signMock = jest
			.spyOn(wallet.transaction(), "signVote")
			.mockReturnValue(Promise.resolve(voteFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [voteFixture.data.id],
			rejected: [],
			errors: {},
		});
		const transactionMock = createVoteTransactionMock(wallet);

		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		fireEvent.input(passwordInput, { target: { value: passphrase } });
		expect(passwordInput).toHaveValue(passphrase);

		await waitFor(() => expect(getByTestId("SendVote__button--submit")).not.toBeDisabled());

		await act(async () => {
			fireEvent.click(getByTestId("SendVote__button--submit"));
		});

		act(() => jest.advanceTimersByTime(1000));

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
		await waitFor(() => expect(container).toMatchSnapshot());

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should move back and forth between steps", async () => {
		const history = createMemoryHistory();
		const voteURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-vote`;

		const params = new URLSearchParams({
			unvotes: delegateData[1].address,
		});

		history.push({
			pathname: voteURL,
			search: `?${params}`,
		});

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<LedgerProvider transport={transport}>
					<SendVote />
				</LedgerProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[1].username));

		fireEvent.input(getByTestId("InputCurrency"), { target: { value: "0.02" } });

		await waitFor(() => expect(getByTestId("SendVote__button--continue")).not.toBeDisabled());
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Review Step
		expect(getByTestId("SendVote__review-step")).toBeTruthy();

		// Back to form
		fireEvent.click(getByTestId("SendVote__button--back"));
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0.02"));

		// Back to review step
		fireEvent.click(getByTestId("SendVote__button--continue"));
		expect(getByTestId("SendVote__review-step")).toBeTruthy();
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Authentication Step
		expect(getByTestId("AuthenticationStep")).toBeTruthy();
		fireEvent.click(getByTestId("SendVote__button--back"));

		// Back to Review Step
		expect(getByTestId("SendVote__review-step")).toBeTruthy();
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Back to AuthenticationStep
		expect(getByTestId("AuthenticationStep")).toBeTruthy();

		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		fireEvent.input(passwordInput, { target: { value: passphrase } });
		await waitFor(() => expect(passwordInput).toHaveValue(passphrase));
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

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<LedgerProvider transport={transport}>
					<SendVote />
				</LedgerProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[1].username));

		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

		await waitFor(() => expect(getByTestId("SendVote__button--continue")).not.toBeDisabled());
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Review Step
		expect(getByTestId("SendVote__review-step")).toBeTruthy();
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// AuthenticationStep
		expect(getByTestId("AuthenticationStep")).toBeTruthy();

		const signMock = jest
			.spyOn(wallet.transaction(), "signVote")
			.mockReturnValue(Promise.resolve(unvoteFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [unvoteFixture.data.id],
			rejected: [],
			errors: {},
		});
		const transactionMock = createUnvoteTransactionMock(wallet);

		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		fireEvent.input(passwordInput, { target: { value: passphrase } });
		expect(passwordInput).toHaveValue(passphrase);

		await waitFor(() => expect(getByTestId("SendVote__button--submit")).not.toBeDisabled());

		await act(async () => {
			fireEvent.click(getByTestId("SendVote__button--submit"));
		});

		act(() => jest.advanceTimersByTime(1000));

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy(), { timeout: 3000 });
		await waitFor(() => expect(container).toMatchSnapshot());

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should return to form step by cancelling fee warning", async () => {
		const history = createMemoryHistory();
		const voteURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-vote`;

		const params = new URLSearchParams({
			votes: delegateData[0].address,
		});

		history.push({
			pathname: voteURL,
			search: `?${params}`,
		});

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<LedgerProvider transport={transport}>
					<SendVote />
				</LedgerProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[0].username));

		// Fee
		fireEvent.change(getByTestId("InputCurrency"), { target: { value: "10" } });
		expect(getByTestId("InputCurrency")).toHaveValue("10");

		await waitFor(() => expect(getByTestId("SendVote__button--continue")).not.toBeDisabled());
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Review Step
		expect(getByTestId("SendVote__review-step")).toBeTruthy();
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Fee warning
		expect(getByTestId("FeeWarning__cancel-button")).toBeTruthy();
		fireEvent.click(getByTestId("FeeWarning__cancel-button"));

		await waitFor(() => expect(getByTestId("SendVote__form-step")).toBeTruthy());
	});

	it("should proceed to authentication step by confirming fee warning", async () => {
		const history = createMemoryHistory();
		const voteURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-vote`;

		const params = new URLSearchParams({
			votes: delegateData[0].address,
		});

		history.push({
			pathname: voteURL,
			search: `?${params}`,
		});

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<LedgerProvider transport={transport}>
					<SendVote />
				</LedgerProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[0].username));

		// Fee
		fireEvent.change(getByTestId("InputCurrency"), { target: { value: "10" } });
		expect(getByTestId("InputCurrency")).toHaveValue("10");

		await waitFor(() => expect(getByTestId("SendVote__button--continue")).not.toBeDisabled());
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Review Step
		expect(getByTestId("SendVote__review-step")).toBeTruthy();
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Fee warning
		expect(getByTestId("FeeWarning__continue-button")).toBeTruthy();
		fireEvent.click(getByTestId("FeeWarning__continue-button"));

		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
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

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<LedgerProvider transport={transport}>
					<SendVote />
				</LedgerProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[0].username));

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[0].username));

		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

		await waitFor(() => expect(getByTestId("SendVote__button--continue")).not.toBeDisabled());
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Review Step
		expect(getByTestId("SendVote__review-step")).toBeTruthy();
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// AuthenticationStep
		expect(getByTestId("AuthenticationStep")).toBeTruthy();

		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		fireEvent.input(passwordInput, { target: { value: "wrong passphrase" } });
		await waitFor(() => expect(passwordInput).toHaveValue("wrong passphrase"));

		await waitFor(() => expect(getByTestId("SendVote__button--submit")).toBeDisabled());

		expect(getByTestId("Input__error")).toBeTruthy();

		await waitFor(() => expect(container).toMatchSnapshot());
	});

	it("should show error step and go back", async () => {
		const history = createMemoryHistory();
		const voteURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-vote`;

		const params = new URLSearchParams({
			votes: delegateData[0].address,
		});

		history.push({
			pathname: voteURL,
			search: `?${params}`,
		});

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<LedgerProvider transport={transport}>
					<SendVote />
				</LedgerProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[0].username));

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[0].username));

		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

		await waitFor(() => expect(getByTestId("SendVote__button--continue")).not.toBeDisabled());
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Review Step
		expect(getByTestId("SendVote__review-step")).toBeTruthy();
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// AuthenticationStep
		expect(getByTestId("AuthenticationStep")).toBeTruthy();

		const signMock = jest.spyOn(wallet.transaction(), "signIpfs").mockImplementation(() => {
			throw new Error();
		});

		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		fireEvent.input(passwordInput, { target: { value: passphrase } });
		await waitFor(() => expect(passwordInput).toHaveValue(passphrase));

		const historyMock = jest.spyOn(history, "push").mockReturnValue();

		await waitFor(() => expect(getByTestId("SendVote__button--submit")).not.toBeDisabled());

		await act(async () => {
			fireEvent.click(getByTestId("SendVote__button--submit"));
		});

		act(() => jest.advanceTimersByTime(1000));

		await waitFor(() => expect(getByTestId("ErrorStep")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("ErrorStep__wallet-button")).toBeInTheDocument());

		await waitFor(() => expect(container).toMatchSnapshot());

		act(() => {
			fireEvent.click(getByTestId("ErrorStep__wallet-button"));
		});

		const walletDetailPage = `/profiles/${getDefaultProfileId()}/wallets/${getDefaultWalletId()}`;
		await waitFor(() => expect(historyMock).toHaveBeenCalledWith(walletDetailPage));

		signMock.mockRestore();
	});

	it("should send a unvote transaction with a multisignature wallet", async () => {
		const isMultiSignatureSpy = jest.spyOn(wallet, "isMultiSignature").mockReturnValue(true);
		const multisignatureSpy = jest
			.spyOn(wallet.multiSignature(), "all")
			.mockReturnValue({ min: 2, publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!] });

		const history = createMemoryHistory();
		const voteURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-vote`;

		const params = new URLSearchParams({
			unvotes: delegateData[1].address,
		});

		history.push({
			pathname: voteURL,
			search: `?${params}`,
		});

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<LedgerProvider transport={transport}>
					<SendVote />
				</LedgerProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[1].username));

		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

		await waitFor(() => expect(getByTestId("SendVote__button--continue")).not.toBeDisabled());
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Review Step
		expect(getByTestId("SendVote__review-step")).toBeTruthy();

		const signMock = jest
			.spyOn(wallet.transaction(), "signVote")
			.mockReturnValue(Promise.resolve(unvoteFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [unvoteFixture.data.id],
			rejected: [],
			errors: {},
		});
		const transactionMock = createUnvoteTransactionMock(wallet);

		await waitFor(() => expect(getByTestId("SendVote__button--continue")).not.toBeDisabled());

		await act(async () => {
			fireEvent.click(getByTestId("SendVote__button--continue"));
		});

		act(() => jest.advanceTimersByTime(1000));

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

		expect(signMock).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.anything(),
				fee: expect.any(String),
				nonce: expect.any(String),
				signatory: expect.any(Object),
			}),
		);

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();

		isMultiSignatureSpy.mockRestore();
		multisignatureSpy.mockRestore();
	});

	it("should send a vote transaction with a ledger wallet", async () => {
		jest.useFakeTimers();

		const isLedgerSpy = jest.spyOn(wallet, "isLedger").mockImplementation(() => true);

		const getPublicKeySpy = jest
			.spyOn(wallet.coin().ledger(), "getPublicKey")
			.mockResolvedValue("0335a27397927bfa1704116814474d39c2b933aabb990e7226389f022886e48deb");

		const signTransactionSpy = jest
			.spyOn(wallet.transaction(), "signVote")
			.mockReturnValue(Promise.resolve(voteFixture.data.id));

		const voteTransactionMock = createVoteTransactionMock(wallet);

		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [voteFixture.data.id],
			rejected: [],
			errors: {},
		});

		const history = createMemoryHistory();
		const voteURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-vote`;

		const params = new URLSearchParams({
			unvotes: delegateData[1].address,
		});

		history.push({
			pathname: voteURL,
			search: `?${params}`,
		});

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<LedgerProvider transport={transport}>
					<SendVote />
				</LedgerProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[1].username));

		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

		await waitFor(() => expect(getByTestId("SendVote__button--continue")).not.toBeDisabled());
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Review Step
		expect(getByTestId("SendVote__review-step")).toBeTruthy();

		await waitFor(() => expect(getByTestId("SendVote__button--continue")).not.toBeDisabled());

		await act(async () => {
			fireEvent.click(getByTestId("SendVote__button--continue"));
		});

		act(() => jest.advanceTimersByTime(1000));

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy(), { timeout: 3000 });

		getPublicKeySpy.mockRestore();
		signTransactionSpy.mockRestore();
		isLedgerSpy.mockRestore();
		broadcastMock.mockRestore();
		voteTransactionMock.mockRestore();
	});

	it("should send a vote transaction using encryption password", async () => {
		const actsWithMnemonicMock = jest.spyOn(wallet, "actsWithMnemonic").mockReturnValue(false);
		const actsWithWifWithEncryptionMock = jest.spyOn(wallet, "actsWithWifWithEncryption").mockReturnValue(true);
		const wifGetMock = jest
			.spyOn(wallet.wif(), "get")
			.mockResolvedValue("S9rDfiJ2ar4DpWAQuaXECPTJHfTZ3XjCPv15gjxu4cHJZKzABPyV");

		const history = createMemoryHistory();
		const voteURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-vote`;

		const params = new URLSearchParams({
			votes: delegateData[0].address,
		});

		history.push({
			pathname: voteURL,
			search: `?${params}`,
		});

		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					fee: "0.1",
				},
			}),
		);

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-vote">
				<FormProvider {...form.current}>
					<LedgerProvider transport={transport}>
						<SendVote />
					</LedgerProvider>
				</FormProvider>
			</Route>,
			{
				routes: [voteURL],
				history,
			},
		);

		expect(getByTestId("SendVote__form-step")).toBeTruthy();
		await waitFor(() => expect(getByTestId("SendVote__form-step")).toHaveTextContent(delegateData[0].username));

		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

		await waitFor(() => expect(getByTestId("SendVote__button--continue")).not.toBeDisabled());
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// Review Step
		expect(getByTestId("SendVote__review-step")).toBeTruthy();
		fireEvent.click(getByTestId("SendVote__button--continue"));

		// AuthenticationStep
		expect(getByTestId("AuthenticationStep")).toBeTruthy();

		const signMock = jest
			.spyOn(wallet.transaction(), "signVote")
			.mockReturnValue(Promise.resolve(voteFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [voteFixture.data.id],
			rejected: [],
			errors: {},
		});
		const transactionMock = createVoteTransactionMock(wallet);

		const passwordInput = getByTestId("AuthenticationStep__encryption-password");
		act(() => {
			fireEvent.input(passwordInput, { target: { value: "password" } });
		});

		await waitFor(() => expect(passwordInput).toHaveValue("password"));

		await waitFor(() => expect(getByTestId("SendVote__button--submit")).not.toBeDisabled());

		await act(async () => {
			fireEvent.click(getByTestId("SendVote__button--submit"));
		});

		act(() => jest.advanceTimersByTime(1000));

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
		actsWithMnemonicMock.mockRestore();
		actsWithWifWithEncryptionMock.mockRestore();
		wifGetMock.mockRestore();
	});
});
