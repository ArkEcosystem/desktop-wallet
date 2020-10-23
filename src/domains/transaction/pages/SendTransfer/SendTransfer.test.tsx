/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { act, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import transactionMultipleFixture from "tests/fixtures/coins/ark/devnet/transactions/transfer-multiple.json";
import transactionFixture from "tests/fixtures/coins/ark/devnet/transactions/transfer.json";
import {
	act as utilsAct,
	env,
	fireEvent,
	getDefaultProfileId,
	getDefaultWalletId,
	getDefaultWalletMnemonic,
	render,
	RenderResult,
	renderWithRouter,
	syncFees,
	waitFor,
	within,
} from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";
import { SendTransfer } from "./SendTransfer";
import { FormStep } from "./Step1";
import { ReviewStep } from "./Step2";
import { SummaryStep } from "./Step4";

const passphrase = getDefaultWalletMnemonic();
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

		await act(async () => {
			const { getByTestId, asFragment } = render(
				<FormProvider {...form.current}>
					<FormStep networks={[]} profile={profile} />
				</FormProvider>,
			);

			expect(getByTestId("SendTransfer__step--first")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
		});
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

		await act(async () => {
			const { getByTestId, asFragment } = render(
				<FormProvider {...form.current}>
					<FormStep networks={[]} profile={profile} deeplinkProps={deeplinkProps} />
				</FormProvider>,
			);

			expect(getByTestId("SendTransfer__step--first")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
		});
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
		expect(container).toHaveTextContent("D8rr7B … s6YUYD");
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
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
			expect(getByTestId("modal__inner")).toBeTruthy();

			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
			expect(getByTestId("SelectRecipient__input")).toHaveValue(
				profile.contacts().values()[0].addresses().values()[0].address(),
			);

			// Amount
			fireEvent.click(getByTestId("add-recipient__send-all"));
			expect(getByTestId("add-recipient__amount-input")).toHaveValue("33.75089801");

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__step--second")).toBeTruthy());

			// Back to Step 1
			fireEvent.click(getByTestId("SendTransfer__button--back"));
			await waitFor(() => expect(getByTestId("SendTransfer__step--first")).toBeTruthy());

			// Step 2
			expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__step--second")).toBeTruthy());

			// Step 3
			expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
			const passwordInput = getByTestId("AuthenticationStep__mnemonic");
			fireEvent.input(passwordInput, { target: { value: passphrase } });
			await waitFor(() => expect(passwordInput).toHaveValue(passphrase));

			// Step 5 (skip step 4 for now - ledger confirmation)
			const signMock = jest
				.spyOn(wallet.transaction(), "signTransfer")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			fireEvent.click(getByTestId("SendTransfer__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent("8f913b6b719e7 … f1b89abb49877");

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

	it("should send a single transfer with a multisignature wallet", async () => {
		const isMultiSignatureSpy = jest.spyOn(wallet, "isMultiSignature").mockImplementation(() => true);
		const multisignatureSpy = jest
			.spyOn(wallet, "multiSignature")
			.mockReturnValue({ min: 2, publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!] });

		const history = createMemoryHistory();
		const transferURL = `/profiles/${fixtureProfileId}/transactions/${wallet.id()}/transfer`;

		history.push(transferURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/transactions/:walletId/transfer">
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
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
			expect(getByTestId("modal__inner")).toBeTruthy();

			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
			expect(getByTestId("SelectRecipient__input")).toHaveValue(
				profile.contacts().values()[0].addresses().values()[0].address(),
			);

			// Amount
			fireEvent.click(getByTestId("add-recipient__send-all"));
			expect(getByTestId("add-recipient__amount-input")).toHaveValue("33.75089801");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__step--second")).toBeTruthy());

			// Step 5 (skip step 4 for now - ledger confirmation)
			const signMock = jest
				.spyOn(wallet.transaction(), "signTransfer")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			fireEvent.click(getByTestId("SendTransfer__button--continue"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent("8f913b6b719e7 … f1b89abb49877");

			// Copy Transaction
			const copyMock = jest.fn();
			const clipboardOriginal = navigator.clipboard;

			// @ts-ignore
			navigator.clipboard = { writeText: copyMock };

			fireEvent.click(getByTestId("SendTransfer__button--copy"));

			await waitFor(() => expect(copyMock).toHaveBeenCalledWith(transactionFixture.data.id));

			expect(signMock).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.anything(),
					fee: "71538139",
					from: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
					nonce: expect.any(String),
					sign: {
						multiSignature: {
							min: 2,
							publicKeys: [
								"03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
								"03af2feb4fc97301e16d6a877d5b135417e8f284d40fac0f84c09ca37f82886c51",
							],
						},
					},
				}),
			);

			// @ts-ignore
			navigator.clipboard = clipboardOriginal;
			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});
		isMultiSignatureSpy.mockRestore();
		multisignatureSpy.mockRestore();
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
			await waitFor(() =>
				expect(rendered.getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()),
			);
			await waitFor(() => expect(rendered.getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

			// Select recipient
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
			expect(getByTestId("modal__inner")).toBeTruthy();

			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
			expect(getByTestId("SelectRecipient__input")).toHaveValue(
				profile.contacts().values()[0].addresses().values()[0].address(),
			);

			// Amount
			fireEvent.click(getByTestId("add-recipient__send-all"));
			expect(getByTestId("add-recipient__amount-input")).toHaveValue("33.75089801");

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__step--second")).toBeTruthy());

			// Step 3
			expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
			const passwordInput = getByTestId("AuthenticationStep__mnemonic");
			fireEvent.input(passwordInput, { target: { value: passphrase } });
			await waitFor(() => expect(passwordInput).toHaveValue(passphrase));

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

	it("should send a multi payment", async () => {
		nock("https://dwallets.ark.io")
			.get("/api/transactions/34b557950ed485985aad81ccefaa374b7c81150c52f8ef4621cbbb907b2c829c")
			.reply(200, transactionMultipleFixture);

		nock("https://dwallets.ark.io")
			.get("/api/wallets/DFJ5Z51F1euNNdRUQJKQVdG4h495LZkc6T")
			.reply(200, require("tests/fixtures/coins/ark/devnet/wallets/DFJ5Z51F1euNNdRUQJKQVdG4h495LZkc6T.json"));

		nock("https://dwallets.ark.io")
			.get("/api/wallets/DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS")
			.reply(200, require("tests/fixtures/coins/ark/devnet/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb.json"));

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

		await waitFor(() => {
			expect(rendered.getByTestId("SelectAddress__input")).toHaveValue(wallet.address());
			expect(rendered.getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name());
		});

		await utilsAct(async () => {
			// Select multiple tab
			fireEvent.click(getByTestId("add-recipient-is-multiple-toggle"));

			// Select recipient
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
			expect(getByTestId("SelectRecipient__input")).toHaveValue(
				profile.contacts().values()[0].addresses().values()[0].address(),
			);

			fireEvent.input(getByTestId("add-recipient__amount-input"), { target: { value: "1" } });
			expect(getByTestId("add-recipient__amount-input")).toHaveValue("1");

			fireEvent.click(getByTestId("add-recipient__add-btn"));
			await waitFor(() => expect(getAllByTestId("recipient-list__recipient-list-item").length).toEqual(1));

			// Select recipient #2
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
			expect(getByTestId("SelectRecipient__input")).toHaveValue(
				profile.contacts().values()[0].addresses().values()[0].address(),
			);

			fireEvent.input(getByTestId("add-recipient__amount-input"), { target: { value: "1" } });
			expect(getByTestId("add-recipient__amount-input")).toHaveValue("1");

			fireEvent.click(getByTestId("add-recipient__add-btn"));
			await waitFor(() => expect(getAllByTestId("recipient-list__recipient-list-item").length).toEqual(2));

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__step--second")).toBeTruthy());

			// Step 3
			expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
			const passwordInput = getByTestId("AuthenticationStep__mnemonic");
			fireEvent.input(passwordInput, { target: { value: passphrase } });
			await waitFor(() => expect(passwordInput).toHaveValue(passphrase));

			// Step 5 (skip step 4 for now - ledger confirmation)
			const coin = await env.coin("ARK", "ark.devnet");
			const coinMock = jest.spyOn(coin.identity().address(), "validate").mockReturnValue(true);

			const signMock = jest
				.spyOn(wallet.transaction(), "signMultiPayment")
				.mockReturnValue(Promise.resolve(transactionMultipleFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMultipleMock(wallet);

			await waitFor(() => expect(getByTestId("SendTransfer__button--submit")).not.toBeDisabled());
			fireEvent.click(getByTestId("SendTransfer__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

			// Copy Transaction
			const copyMock = jest.fn();
			const clipboardOriginal = navigator.clipboard;

			// @ts-ignore
			navigator.clipboard = { writeText: copyMock };

			fireEvent.click(getByTestId("SendTransfer__button--copy"));

			await waitFor(() => expect(copyMock).toHaveBeenCalledWith(transactionMultipleFixture.data.id));

			// @ts-ignore
			navigator.clipboard = clipboardOriginal;

			coinMock.mockRestore();
			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			// Go back to wallet
			const historySpy = jest.spyOn(history, "push");
			fireEvent.click(getByTestId("SendTransfer__button--back-to-wallet"));
			expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);
			historySpy.mockRestore();
		});
	});
});
