/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
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
	getDefaultWalletId,
	render,
	RenderResult,
	renderWithRouter,
	syncFees,
	waitFor,
	within,
} from "testing-library";
import transactionMultipleFixture from "tests/fixtures/coins/ark/devnet/transactions/transfer-multiple.json";
import transactionFixture from "tests/fixtures/coins/ark/devnet/transactions/transfer.json";

import { translations as transactionTranslations } from "../../i18n";
import { SendTransfer } from "./SendTransfer";
import { FormStep } from "./Step1";
import { ReviewStep } from "./Step2";
import { SummaryStep } from "./Step4";

const fixtureProfileId = getDefaultProfileId();
const fixtureWalletId = getDefaultWalletId();

const createTransactionMultipleMock = (wallet: ReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		id: () => transactionMultipleFixture.data.id,
		sender: () => transactionMultipleFixture.data.sender,
		recipient: () => transactionMultipleFixture.data.recipient,
		amount: () => BigNumber.make(transactionMultipleFixture.data.amount),
		fee: () => BigNumber.make(transactionMultipleFixture.data.fee),
		data: () => transactionMultipleFixture.data,
	});

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

beforeAll(async () => {
	profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
	wallet = profile.wallets().values()[0];

	nock("https://dwallets.ark.io")
		.get("/api/transactions")
		.query((params) => !!params.address)
		.reply(200, require("tests/fixtures/coins/ark/devnet/transactions.json"))
		.get("/api/transactions/8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877")
		.reply(200, transactionFixture);

	await syncFees();
});

describe("SendTransfer", () => {
	it("should render 1st step (form)", async () => {
		const { result: form } = renderHook(() => useForm());

		const { getByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<FormStep networks={[]} profile={profile} />
			</FormProvider>,
		);

		expect(getByTestId("SendTransfer__step--first")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 1st step with deeplink values and use them", async () => {
		const { result: form } = renderHook(() => useForm());
		const deeplinkProps: any = {
			amount: "1.2",
			coin: "ark",
			memo: "ARK",
			method: "transfer",
			network: "mainnet",
			recipient: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
		};

		const { getByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<FormStep networks={[]} profile={profile} deeplinkProps={deeplinkProps} />
			</FormProvider>,
		);

		expect(getByTestId("SendTransfer__step--first")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step (review)", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					fee: (0.1 * 1e8).toFixed(0),
					recipients: [
						{
							address: wallet.address(),
							amount: BigNumber.make(1 * 1e8),
						},
					],
					senderAddress: wallet.address(),
					smartbridge: "test smartbridge",
				},
			}),
		);

		const { asFragment, container, getByTestId } = render(
			<FormProvider {...form.current}>
				<ReviewStep wallet={wallet} />
			</FormProvider>,
		);

		expect(getByTestId("SendTransfer__step--second")).toBeTruthy();
		expect(container).toHaveTextContent(wallet.network().name());
		expect(container).toHaveTextContent("D8rr7B…s6YUYD");
		expect(container).toHaveTextContent("test smartbridge");

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 4th step (summary)", async () => {
		const { result: form } = renderHook(() => useForm());

		const transaction = (await wallet.transactions()).findById(
			"8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877",
		);

		const { getByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<SummaryStep transaction={transaction!} senderWallet={wallet} />
			</FormProvider>,
		);

		expect(getByTestId("TransactionSuccessful")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render registration form without selected wallet", async () => {
		const history = createMemoryHistory();
		let rendered: RenderResult;

		const transferURL = `/profiles/${fixtureProfileId}/send-transfer`;
		history.push(transferURL);

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/send-transfer">
					<SendTransfer />
				</Route>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__step--first")).toBeTruthy());
		});

		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it("should render form and use location state", async () => {
		const history = createMemoryHistory();
		let rendered: RenderResult;

		const transferURL = `/profiles/${fixtureProfileId}/wallets/${fixtureWalletId}/send-transfer`;
		history.push(transferURL, { memo: "ARK" });

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
					<SendTransfer />
				</Route>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__step--first")).toBeTruthy());
		});

		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it("should select cryptoasset first and see select address input clickable", async () => {
		const history = createMemoryHistory();
		let rendered: RenderResult;

		const transferURL = `/profiles/${fixtureProfileId}/send-transfer`;
		history.push(transferURL);

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/send-transfer">
					<SendTransfer />
				</Route>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__step--first")).toBeTruthy());
		});

		act(() => {
			fireEvent.focus(rendered.getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() => expect(rendered.getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy());

		act(() => {
			fireEvent.click(rendered.getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		expect(rendered.getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK Devnet");
		expect(rendered.getByTestId("SelectAddress__wrapper")).not.toHaveAttribute("disabled");
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it("should display disabled address selection input if selected cryptoasset has not available wallets", async () => {
		const history = createMemoryHistory();
		let rendered: RenderResult;

		const transferURL = `/profiles/${fixtureProfileId}/send-transfer`;
		history.push(transferURL);

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/send-transfer">
					<SendTransfer />
				</Route>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__step--first")).toBeTruthy());
		});

		act(() => {
			fireEvent.focus(rendered.getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() => expect(rendered.getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy());

		act(() => {
			fireEvent.click(rendered.getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		expect(rendered.getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK Devnet");
		expect(rendered.getByTestId("SelectAddress__wrapper")).not.toHaveAttribute("disabled");
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it("should select a cryptoasset and select sender without wallet id param", async () => {
		const history = createMemoryHistory();
		const transferURL = `/profiles/${fixtureProfileId}/send-transfer`;

		history.push(transferURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/send-transfer">
					<SendTransfer />
				</Route>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__step--first")).toBeTruthy());
		});

		const { getAllByTestId, getByTestId } = rendered!;

		await act(async () => {
			// Select cryptoasset
			fireEvent.focus(rendered.getByTestId("SelectNetworkInput__input"));

			await waitFor(() => expect(rendered.getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy());

			fireEvent.click(rendered.getByTestId("NetworkIcon-ARK-ark.devnet"));

			expect(rendered.getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK Devnet");

			// Select sender
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			const firstAddress = getByTestId("SearchWalletListItem__select-1");
			fireEvent.click(firstAddress);
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});

	it("should send a single transfer", async () => {
		const history = createMemoryHistory();
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

		history.push(transferURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
					<SendTransfer />
				</Route>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__step--first")).toBeTruthy());
		});

		const { getAllByTestId, getByTestId } = rendered!;

		await act(async () => {
			await waitFor(() =>
				expect(rendered.getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()),
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
			expect(getByTestId("add-recipient__amount-input")).toHaveValue("33.03551662");

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("SendTransfer__button--back"));
			await waitFor(() => expect(getByTestId("SendTransfer__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
			const passwordInput = getByTestId("AuthenticationStep__mnemonic");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			// Step 5 (skip step 4 for now - ledger confirmation)
			const signMock = jest
				.spyOn(wallet.transaction(), "signTransfer")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			fireEvent.click(getByTestId("SendTransfer__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent("8f913b6b719e7…f1b89abb49877");

			// Copy Transaction
			const copyMock = jest.fn();
			const clipboardOriginal = navigator.clipboard;

			// @ts-ignore
			navigator.clipboard = { writeText: copyMock };

			fireEvent.click(getByTestId("SendTransfer__button--copy"));

			await waitFor(() => expect(copyMock).toHaveBeenCalledWith(transactionFixture.data.id));

			// @ts-ignore
			navigator.clipboard = clipboardOriginal;

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());

			// Go back to wallet
			const historySpy = jest.spyOn(history, "push");
			fireEvent.click(getByTestId("SendTransfer__button--back-to-wallet"));
			expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);
			historySpy.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});

	it("should send a multi payment", async () => {
		nock("https://dwallets.ark.io")
			.get("/api/transactions/34b557950ed485985aad81ccefaa374b7c81150c52f8ef4621cbbb907b2c829c")
			.reply(200, transactionMultipleFixture);

		const history = createMemoryHistory();
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

		history.push(transferURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
					<SendTransfer />
				</Route>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__step--first")).toBeTruthy());
		});

		const { getByTestId } = rendered!;

		await act(async () => {
			await waitFor(() =>
				expect(rendered.getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()),
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
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("SendTransfer__button--back"));
			await waitFor(() => expect(getByTestId("SendTransfer__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
			const passwordInput = getByTestId("AuthenticationStep__mnemonic");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			// Step 5 (skip step 4 for now - ledger confirmation)
			const signMock = jest
				.spyOn(wallet.transaction(), "signMultiPayment")
				.mockReturnValue(Promise.resolve(transactionMultipleFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMultipleMock(wallet);

			fireEvent.click(getByTestId("SendTransfer__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent("34b557950ed48…bbb907b2c829c");

			// Copy Transaction
			const copyMock = jest.fn();
			const clipboardOriginal = navigator.clipboard;

			// @ts-ignore
			navigator.clipboard = { writeText: copyMock };

			fireEvent.click(getByTestId("SendTransfer__button--copy"));

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
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

		history.push(transferURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
					<SendTransfer />
				</Route>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__step--first")).toBeTruthy());
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
			expect(getByTestId("add-recipient__amount-input")).toHaveValue("13.03551662");

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("SendTransfer__button--back"));
			await waitFor(() => expect(getByTestId("SendTransfer__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
			const passwordInput = getByTestId("AuthenticationStep__mnemonic");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			// Step 5 (skip step 4 for now - ledger confirmation)
			const signMock = jest.spyOn(wallet.transaction(), "signTransfer").mockImplementation(() => {
				throw new Error();
			});

			const consoleSpy = jest.spyOn(console, "error").mockImplementation();

			fireEvent.click(getByTestId("SendTransfer__button--submit"));

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
