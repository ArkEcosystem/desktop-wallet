/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { act, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import {
	env,
	fireEvent,
	getDefaultProfileId,
	render,
	RenderResult,
	renderWithRouter,
	syncDelegates,
	waitFor,
	within,
} from "testing-library";
import { data as delegateData } from "tests/fixtures/coins/ark/delegates-devnet.json";
import transactionFixture from "tests/fixtures/coins/ark/transactions/transfer.json";

import { translations as transactionTranslations } from "../../i18n";
import { FirstStep, FourthStep, SecondStep, SendVoteTransaction, ThirdStep } from "../SendVoteTransaction";

const fixtureProfileId = getDefaultProfileId();

const createTransactionMock = (wallet: ReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		id: () => transactionFixture.data.id,
		sender: () => transactionFixture.data.sender,
		recipient: () => transactionFixture.data.recipient,
		amount: () => BigNumber.make(transactionFixture.data.amount),
		fee: () => BigNumber.make(transactionFixture.data.fee),
		data: () => transactionFixture.data,
	});

let profile: Profile;
let wallet: ReadWriteWallet;
let votes: ReadOnlyWallet[];

describe("Vote For Delegate", () => {
	beforeAll(async () => {
		await syncDelegates();

		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		votes = [0, 1].map((index) =>
			env.delegates().findByAddress(wallet.coinId(), wallet.networkId(), delegateData[index].address),
		);

		nock("https://dwallets.ark.io")
			.post("/api/transactions/search")
			.reply(200, require("tests/fixtures/coins/ark/transactions.json"))
			.get("/api/transactions/8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877")
			.reply(200, transactionFixture);
	});

	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep profile={profile} wallet={wallet} unvotes={[]} votes={votes} />
			</FormContext>,
		);

		expect(getByTestId("SendVoteTransaction__step--first")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2st step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<SecondStep profile={profile} wallet={wallet} unvotes={[]} votes={votes} />
			</FormContext>,
		);

		expect(getByTestId("SendVoteTransaction__step--second")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<ThirdStep />
			</FormContext>,
		);

		expect(getByTestId("SendVoteTransaction__step--third")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 4th step", async () => {
		const { result: form } = renderHook(() => useForm());
		const transaction = (await wallet.transactions()).findById(
			"8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877",
		);
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FourthStep transaction={transaction!} unvotes={[]} votes={votes} />
			</FormContext>,
		);

		expect(getByTestId("TransactionSuccessful")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should send a unvote & vote transaction", async () => {
		const history = createMemoryHistory();
		const voteTransactionURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/transactions/vote/`;

		const params = new URLSearchParams({
			unvotes: delegateData[1].address,
			votes: delegateData[0].address,
		});

		history.push({
			pathname: voteTransactionURL,
			search: `?${params}`,
		});

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/transactions/vote">
					<SendVoteTransaction />
				</Route>,
				{
					routes: [voteTransactionURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendVoteTransaction__step--first")).toBeTruthy());
			await waitFor(() =>
				expect(rendered.getByTestId("SendVoteTransaction__step--first")).toHaveTextContent(
					delegateData[0].username,
				),
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
			fireEvent.click(getByTestId("SendVoteTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVoteTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--third")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("SendVoteTransaction__button--back"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVoteTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--third")).toBeTruthy());
			const passwordInput = within(getByTestId("InputPassword")).getByTestId("Input");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			const signMock = jest
				.spyOn(wallet.transaction(), "signVote")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			fireEvent.click(getByTestId("SendVoteTransaction__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});

	it("should send a unvote transaction", async () => {
		const history = createMemoryHistory();
		const voteTransactionURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/transactions/vote/`;

		const params = new URLSearchParams({
			unvotes: delegateData[0].address,
		});

		history.push({
			pathname: voteTransactionURL,
			search: `?${params}`,
		});

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/transactions/vote">
					<SendVoteTransaction />
				</Route>,
				{
					routes: [voteTransactionURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendVoteTransaction__step--first")).toBeTruthy());
			await waitFor(() =>
				expect(rendered.getByTestId("SendVoteTransaction__step--first")).toHaveTextContent(
					delegateData[0].username,
				),
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
			fireEvent.click(getByTestId("SendVoteTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVoteTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--third")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("SendVoteTransaction__button--back"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVoteTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--third")).toBeTruthy());
			const passwordInput = within(getByTestId("InputPassword")).getByTestId("Input");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			const signMock = jest
				.spyOn(wallet.transaction(), "signVote")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			fireEvent.click(getByTestId("SendVoteTransaction__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});

	it("should send a vote transaction", async () => {
		const history = createMemoryHistory();
		const voteTransactionURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/transactions/vote/`;

		const params = new URLSearchParams({
			votes: delegateData[0].address,
		});

		history.push({
			pathname: voteTransactionURL,
			search: `?${params}`,
		});

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/transactions/vote">
					<SendVoteTransaction />
				</Route>,
				{
					routes: [voteTransactionURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendVoteTransaction__step--first")).toBeTruthy());
			await waitFor(() =>
				expect(rendered.getByTestId("SendVoteTransaction__step--first")).toHaveTextContent(
					delegateData[0].username,
				),
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
			fireEvent.click(getByTestId("SendVoteTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVoteTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--third")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("SendVoteTransaction__button--back"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVoteTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--third")).toBeTruthy());
			const passwordInput = within(getByTestId("InputPassword")).getByTestId("Input");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			const signMock = jest
				.spyOn(wallet.transaction(), "signVote")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			fireEvent.click(getByTestId("SendVoteTransaction__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});

	it("should error if wrong mnemonic", async () => {
		const history = createMemoryHistory();
		const voteTransactionURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/transactions/vote`;

		const params = new URLSearchParams({
			votes: delegateData[0].address,
		});

		history.push({
			pathname: voteTransactionURL,
			search: `?${params}`,
		});

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/transactions/vote">
					<SendVoteTransaction />
				</Route>,
				{
					routes: [voteTransactionURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendVoteTransaction__step--first")).toBeTruthy());
			await waitFor(() =>
				expect(rendered.getByTestId("SendVoteTransaction__step--first")).toHaveTextContent(
					delegateData[0].username,
				),
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
			fireEvent.click(getByTestId("SendVoteTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVoteTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--third")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("SendVoteTransaction__button--back"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendVoteTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendVoteTransaction__step--third")).toBeTruthy());
			const passwordInput = within(getByTestId("InputPassword")).getByTestId("Input");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			const signMock = jest.spyOn(wallet.transaction(), "signVote").mockImplementation(() => {
				throw new Error();
			});

			const consoleSpy = jest.spyOn(console, "error").mockImplementation();

			fireEvent.click(getByTestId("SendVoteTransaction__button--submit"));

			await waitFor(() => expect(consoleSpy).toHaveBeenCalledTimes(1));
			await waitFor(() => expect(passwordInput).toHaveValue(""));
			await waitFor(() =>
				expect(getByTestId("SendVoteTransaction__step--third")).toHaveTextContent(
					transactionTranslations.INVALID_MNEMONIC,
				),
			);

			signMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});
});
