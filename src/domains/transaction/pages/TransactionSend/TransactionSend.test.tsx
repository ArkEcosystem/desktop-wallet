/* eslint-disable @typescript-eslint/require-await */
import { Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
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
	waitFor,
	within,
} from "testing-library";
import transactionMultipleFixture from "tests/fixtures/coins/ark/transactions/transfer-multiple.json";
import transactionFixture from "tests/fixtures/coins/ark/transactions/transfer.json";

import { translations as transactionTranslations } from "../../i18n";
import { FifthStep, FirstStep, FourthStep, SecondStep, ThirdStep, TransactionSend } from "../TransactionSend";

const fixtureProfileId = getDefaultProfileId();

const createTransactionMultipleMock = (wallet: Wallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		id: () => transactionMultipleFixture.data.id,
		sender: () => transactionMultipleFixture.data.sender,
		recipient: () => transactionMultipleFixture.data.recipient,
		amount: () => BigNumber.make(transactionMultipleFixture.data.amount),
		fee: () => BigNumber.make(transactionMultipleFixture.data.fee),
		data: () => transactionMultipleFixture.data,
	});

const createTransactionMock = (wallet: Wallet) =>
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
let wallet: Wallet;

beforeAll(async () => {
	profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
	wallet = profile.wallets().values()[0];

	nock("https://dwallets.ark.io")
		.post("/api/transactions/search")
		.reply(200, require("tests/fixtures/coins/ark/transactions.json"))
		.get("/api/transactions/8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877")
		.reply(200, transactionFixture);
});

describe("Transaction Send", () => {
	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());

		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep networks={[]} profile={profile} />
			</FormContext>,
		);

		expect(getByTestId("TransactionSend__step--first")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					fee: (0.1 * 1e8).toFixed(0),
					recipients: [
						{
							address: wallet.address(),
							amount: (1 * 1e8).toFixed(0),
						},
					],
					senderAddress: wallet.address(),
					smartbridge: "test smartbridge",
				},
			}),
		);

		const { asFragment, container, getByTestId } = render(
			<FormContext {...form.current}>
				<SecondStep wallet={wallet} />
			</FormContext>,
		);

		expect(getByTestId("TransactionSend__step--second")).toBeTruthy();
		expect(container).toHaveTextContent(wallet.network().name);
		expect(container).toHaveTextContent("D8rr7B…s6YUYD");
		expect(container).toHaveTextContent("test smartbridge");

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<ThirdStep />
			</FormContext>,
		);

		expect(getByTestId("TransactionSend__step--third")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 4th step", async () => {
		const { result: form } = renderHook(() => useForm());

		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FourthStep />
			</FormContext>,
		);

		expect(getByTestId("TransactionSend__step--fourth")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 5th step", async () => {
		const { result: form } = renderHook(() => useForm());

		const transaction = (await wallet.transactions()).findById(
			"8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877",
		);
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FifthStep transaction={transaction!} />
			</FormContext>,
		);

		expect(getByTestId("TransactionSuccessful")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should send a single transfer", async () => {
		const history = createMemoryHistory();
		const transferURL = `/profiles/${fixtureProfileId}/transactions/${wallet.id()}/transfer`;

		history.push(transferURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/transactions/:walletId/transfer">
					<TransactionSend />
				</Route>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("TransactionSend__step--first")).toBeTruthy());
		});

		const { getAllByTestId, getByTestId } = rendered!;

		await act(async () => {
			await waitFor(() =>
				expect(rendered.getByTestId("NetworkIcon-ARK-devnet")).toHaveClass("border-theme-success-200"),
			);
			await waitFor(() => expect(rendered.getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

			// Select recipient
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-contact"));
			expect(getByTestId("modal__inner")).toBeTruthy();

			fireEvent.click(getAllByTestId("ContactListItem__one-option-button-0")[0]);
			expect(getByTestId("SelectRecipient__input")).toHaveValue(
				profile.contacts().values()[0].addresses().values()[0].address(),
			);

			// Amount
			fireEvent.click(getByTestId("add-recipient__send-all"));
			expect(getByTestId("add-recipient__amount-input")).toHaveValue(80);

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			fireEvent.click(getByTestId("TransactionSend__button--continue"));
			await waitFor(() => expect(getByTestId("TransactionSend__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("TransactionSend__button--continue"));
			await waitFor(() => expect(getByTestId("TransactionSend__step--third")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("TransactionSend__button--back"));
			await waitFor(() => expect(getByTestId("TransactionSend__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("TransactionSend__button--continue"));
			await waitFor(() => expect(getByTestId("TransactionSend__step--third")).toBeTruthy());
			const passwordInput = within(getByTestId("InputPassword")).getByTestId("Input");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			// Step 5 (skip step 4 for now - ledger confirmation)
			const signMock = jest
				.spyOn(wallet.transaction(), "signTransfer")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			fireEvent.click(getByTestId("TransactionSend__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent("8f913b6b719e77…2f1b89abb49877");

			// Copy Transaction
			const copyMock = jest.fn();
			const clipboardOriginal = navigator.clipboard;

			// @ts-ignore
			navigator.clipboard = { writeText: copyMock };

			fireEvent.click(getByTestId("TransactionSend__button--copy"));

			await waitFor(() => expect(copyMock).toHaveBeenCalledWith(transactionFixture.data.id));

			// @ts-ignore
			navigator.clipboard = clipboardOriginal;

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());

			// Go back to wallet
			const historySpy = jest.spyOn(history, "push");
			fireEvent.click(getByTestId("TransactionSend__button--back-to-wallet"));
			expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);
			historySpy.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});

	it("should send a multi payment transfer", async () => {
		nock("https://dwallets.ark.io")
			.post("/api/transactions/search")
			.reply(200, require("tests/fixtures/coins/ark/transactions.json"))
			.get("/api/transactions/34b557950ed485985aad81ccefaa374b7c81150c52f8ef4621cbbb907b2c829c")
			.reply(200, transactionMultipleFixture);

		const history = createMemoryHistory();
		const transferURL = `/profiles/${fixtureProfileId}/transactions/${wallet.id()}/transfer`;

		history.push(transferURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/transactions/:walletId/transfer">
					<TransactionSend />
				</Route>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("TransactionSend__step--first")).toBeTruthy());
		});

		const { getByTestId } = rendered!;

		await act(async () => {
			await waitFor(() =>
				expect(rendered.getByTestId("NetworkIcon-ARK-devnet")).toHaveClass("border-theme-success-200"),
			);
			await waitFor(() => expect(rendered.getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

			// Select multiple button
			await waitFor(() => expect(getByTestId("add-recipient-is-multiple-toggle")).toBeTruthy());
			fireEvent.click(getByTestId("add-recipient-is-multiple-toggle"));

			// Add recipient #1
			fireEvent.input(getByTestId("SelectRecipient__input"), {
				target: { value: "DReUcXWdCz2QLKzHM9NdZQE7fAwAyPwAmd" },
			});
			fireEvent.input(getByTestId("add-recipient__amount-input"), { target: { value: "10" } });
			await waitFor(() => expect(getByTestId("add-recipient__add-btn")).toBeTruthy());
			fireEvent.click(getByTestId("add-recipient__add-btn"));

			// Add recipient #2
			fireEvent.input(getByTestId("SelectRecipient__input"), {
				target: { value: "D7JJ4ZfkJDwDCwuwzhtbCFapBUCWU3HHGP" },
			});
			fireEvent.input(getByTestId("add-recipient__amount-input"), { target: { value: "10" } });
			await waitFor(() => expect(getByTestId("add-recipient__add-btn")).toBeTruthy());
			fireEvent.click(getByTestId("add-recipient__add-btn"));

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			fireEvent.click(getByTestId("TransactionSend__button--continue"));
			await waitFor(() => expect(getByTestId("TransactionSend__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("TransactionSend__button--continue"));
			await waitFor(() => expect(getByTestId("TransactionSend__step--third")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("TransactionSend__button--back"));
			await waitFor(() => expect(getByTestId("TransactionSend__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("TransactionSend__button--continue"));
			await waitFor(() => expect(getByTestId("TransactionSend__step--third")).toBeTruthy());
			const passwordInput = within(getByTestId("InputPassword")).getByTestId("Input");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			// Step 5 (skip step 4 for now - ledger confirmation)
			const signMock = jest
				.spyOn(wallet.transaction(), "signMultiPayment")
				.mockReturnValue(Promise.resolve(transactionMultipleFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMultipleMock(wallet);

			fireEvent.click(getByTestId("TransactionSend__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent("34b557950ed485…cbbb907b2c829c");

			// Copy Transaction
			const copyMock = jest.fn();
			const clipboardOriginal = navigator.clipboard;

			// @ts-ignore
			navigator.clipboard = { writeText: copyMock };

			fireEvent.click(getByTestId("TransactionSend__button--copy"));

			await waitFor(() => expect(copyMock).toHaveBeenCalledWith(transactionMultipleFixture.data.id));

			// @ts-ignore
			navigator.clipboard = clipboardOriginal;

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});

	it("should error if wrong mnemonic", async () => {
		const history = createMemoryHistory();
		const transferURL = `/profiles/${fixtureProfileId}/transactions/${wallet.id()}/transfer`;

		history.push(transferURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/transactions/:walletId/transfer">
					<TransactionSend />
				</Route>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("TransactionSend__step--first")).toBeTruthy());
		});

		const { getAllByTestId, getByTestId } = rendered!;

		await act(async () => {
			// Select recipient
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-contact"));
			expect(getByTestId("modal__inner")).toBeTruthy();

			fireEvent.click(getAllByTestId("ContactListItem__one-option-button-0")[0]);
			expect(getByTestId("SelectRecipient__input")).toHaveValue(
				profile.contacts().values()[0].addresses().values()[0].address(),
			);

			// Amount
			fireEvent.click(getByTestId("add-recipient__send-all"));
			expect(getByTestId("add-recipient__amount-input")).toHaveValue(80);

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			fireEvent.click(getByTestId("TransactionSend__button--continue"));
			await waitFor(() => expect(getByTestId("TransactionSend__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("TransactionSend__button--continue"));
			await waitFor(() => expect(getByTestId("TransactionSend__step--third")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("TransactionSend__button--back"));
			await waitFor(() => expect(getByTestId("TransactionSend__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("TransactionSend__button--continue"));
			await waitFor(() => expect(getByTestId("TransactionSend__step--third")).toBeTruthy());
			const passwordInput = within(getByTestId("InputPassword")).getByTestId("Input");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			// Step 5 (skip step 4 for now - ledger confirmation)
			const signMock = jest.spyOn(wallet.transaction(), "signTransfer").mockImplementation(() => {
				throw new Error();
			});

			const consoleSpy = jest.spyOn(console, "error").mockImplementation();

			fireEvent.click(getByTestId("TransactionSend__button--submit"));

			await waitFor(() => expect(consoleSpy).toHaveBeenCalledTimes(1));
			await waitFor(() => expect(passwordInput).toHaveValue(""));
			await waitFor(() =>
				expect(getByTestId("TransactionSend__step--third")).toHaveTextContent(
					transactionTranslations.INVALID_MNEMONIC,
				),
			);

			signMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});
});
