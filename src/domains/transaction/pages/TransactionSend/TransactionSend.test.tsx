/* eslint-disable @typescript-eslint/require-await */
import { Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
// TODO: Import and Mocking like this is a big no-go. Remove this and instead mock network requests and avoid mocking offline method calls.
import { TransactionService } from "@arkecosystem/platform-sdk-profiles/dist/wallets/wallet-transaction-service";
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
import transactionFixture from "tests/fixtures/coins/ark/transactions/transfer.json";

import { translations as transactionTranslations } from "../../i18n";
import { FifthStep, FirstStep, FourthStep, SecondStep, ThirdStep, TransactionSend } from "../TransactionSend";

const fixtureProfileId = getDefaultProfileId();

// @ts-ignore
const createTransactionMock = () =>
	jest.spyOn(TransactionService.prototype, "transaction").mockReturnValue({
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

			await waitFor(() => expect(rendered.getByTestId(`TransactionSend__step--first`)).toBeTruthy());
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
			fireEvent.click(feeOptions[2]);
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
				.spyOn(TransactionService.prototype, "signTransfer")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(TransactionService.prototype, "broadcast").mockImplementation();
			const transactionMock = createTransactionMock();

			fireEvent.click(getByTestId("TransactionSend__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent("8f913b6b719e77…2f1b89abb49877");

			// Copy Transaction
			const copyMock = jest.fn();
			const clipboardOriginal = navigator.clipboard;

			// @ts-ignore
			navigator.clipboard = { writeText: copyMock };

			fireEvent.click(getByTestId(`TransactionSend__button--copy`));

			await waitFor(() =>
				expect(copyMock).toHaveBeenCalledWith(
					JSON.stringify(
						{
							id: "8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877",
							blockId: "2a690f25cb1603275936665162e26415cad14199dda141d33666597c8bca8c5c",
							version: 2,
							type: 0,
							typeGroup: 1,
							amount: "40000000000000",
							fee: "10000000",
							sender: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
							senderPublicKey: "03d3fdad9c5b25bf8880e6b519eb3611a5c0b31adebc8455f0e096175b28321aff",
							recipient: "D5pVkhZbSb4UNXvfmF6j7zdau8yGxfKwSv",
							signature:
								"a6244e06e0f0d446326de249a56a26c432e4af18f3f6374dcea599a691877441dcaff88c0c8cfb73ecc5e923ee93996e6157382bc906f2ab588695354e40a92d",
							signSignature:
								"e09755da1246e3c27786f4048ef9b633784d05bfa3071dffc0a50a996660830db2befc057a34b30faded87b1c0f59e19ee54fb330764c8f45588711d70aa6aa8",
							confirmations: 154178,
							timestamp: {
								epoch: 105390200,
								unix: 1595491400,
								human: "2020-07-23T08:03:20.000Z",
							},
							nonce: "276",
						},
						null,
						2,
					),
				),
			);

			// @ts-ignore
			navigator.clipboard = clipboardOriginal;

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});

	it("should send a multi payment", async () => {
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

			await waitFor(() => expect(rendered.getByTestId(`TransactionSend__step--first`)).toBeTruthy());
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
				target: { value: "DT11QcbKqTXJ59jrUTpcMyggTcwmyFYRTM" },
			});
			fireEvent.input(getByTestId("add-recipient__amount-input"), { target: { value: "10" } });
			await waitFor(() => expect(getByTestId("add-recipient__add-btn")).toBeTruthy());
			fireEvent.click(getByTestId("add-recipient__add-btn"));

			// Add recipient #2
			fireEvent.input(getByTestId("SelectRecipient__input"), {
				target: { value: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib" },
			});
			fireEvent.input(getByTestId("add-recipient__amount-input"), { target: { value: "20" } });
			await waitFor(() => expect(getByTestId("add-recipient__add-btn")).toBeTruthy());
			fireEvent.click(getByTestId("add-recipient__add-btn"));

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[2]);
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
				.spyOn(TransactionService.prototype, "signMultiPayment")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(TransactionService.prototype, "broadcast").mockImplementation();
			const transactionMock = createTransactionMock();

			fireEvent.click(getByTestId("TransactionSend__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent("8f913b6b719e77…2f1b89abb49877");

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

			await waitFor(() => expect(rendered.getByTestId(`TransactionSend__step--first`)).toBeTruthy());
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
			fireEvent.click(feeOptions[2]);
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
			const signMock = jest.spyOn(TransactionService.prototype, "signTransfer").mockImplementation(() => {
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
