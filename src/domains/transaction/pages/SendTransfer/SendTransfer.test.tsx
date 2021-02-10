/* eslint-disable @typescript-eslint/require-await */
import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { act, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import transactionFixture from "tests/fixtures/coins/ark/devnet/transactions/transfer.json";
import transactionMultipleFixture from "tests/fixtures/coins/ark/devnet/transactions/transfer-multiple.json";
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

import { FormStep, ReviewStep, SendTransfer, SummaryStep } from "./";

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

describe("SendTransfer", () => {
	beforeAll(async () => {
		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
		wallet = profile.wallets().values()[0];

		nock("https://dwallets.ark.io")
			.get("/api/transactions?address=D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
			.reply(200, require("tests/fixtures/coins/ark/devnet/transactions.json"))
			.get("/api/transactions?page=1&limit=20&senderId=D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
			.reply(200, { meta: {}, data: [] });

		await syncFees();
	});

	it("should render 1st step (form)", async () => {
		const { result: form } = renderHook(() => useForm());
		await act(async () => {
			const { getByTestId, asFragment } = render(
				<FormProvider {...form.current}>
					<FormStep networks={[]} profile={profile} />
				</FormProvider>,
			);

			expect(getByTestId("SendTransfer__form-step")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should render 1st step (form) without test networks", async () => {
		const { result: form } = renderHook(() => useForm());

		const useNetworksMock = jest.spyOn(profile.settings(), "get").mockReturnValue(false);

		await act(async () => {
			const { getByTestId, asFragment } = render(
				<FormProvider {...form.current}>
					<FormStep networks={env.availableNetworks()} profile={profile} />
				</FormProvider>,
			);

			expect(getByTestId("SendTransfer__form-step")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
		});
		useNetworksMock.mockRestore();
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

			expect(getByTestId("SendTransfer__form-step")).toBeTruthy();
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

		expect(getByTestId("SendTransfer__review-step")).toBeTruthy();
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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
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

	it("should recalculate amount when fee changes and send all is selected", async () => {
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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
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
			await waitFor(() =>
				expect(getByTestId("SelectRecipient__input")).toHaveValue(
					profile.contacts().values()[0].addresses().values()[0].address(),
				),
			);

			// Amount
			const sendAll = getByTestId("AddRecipient__send-all");
			fireEvent.click(sendAll);
			await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"));

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[0]);
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0.00357"));
			fireEvent.click(fees[1]);
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0.71538139"));
			fireEvent.click(fees[2]);
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("6.63"));
		});
	});

	it("should handle fee change when send all is selected with zero balance", async () => {
		const history = createMemoryHistory();

		const emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		const emptyWallet = await emptyProfile.wallets().importByMnemonic("test", "ARK", "ark.devnet");

		const transferURL = `/profiles/${emptyProfile.id()}/wallets/${emptyWallet.id()}/send-transfer`;

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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
		});

		const { getByTestId } = rendered!;

		await act(async () => {
			await waitFor(() =>
				expect(rendered.getByTestId("SelectAddress__input")).toHaveValue(emptyWallet.address()),
			);

			// Select recipient
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
			expect(getByTestId("modal__inner")).toBeTruthy();

			// Amount
			const sendAll = getByTestId("AddRecipient__send-all");
			fireEvent.click(sendAll);
			await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"));

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[0]);
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0.00357"));
			fireEvent.click(fees[1]);
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0.71538139"));
			fireEvent.click(fees[2]);
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("6.63"));
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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
		});

		const { getAllByTestId, getByTestId } = rendered!;

		await act(async () => {
			await waitFor(() =>
				expect(rendered.getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()),
			);
			await waitFor(() => expect(rendered.getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

			const goSpy = jest.spyOn(history, "go").mockImplementation();

			const backButton = getByTestId("SendTransfer__button--back");
			expect(backButton).not.toHaveAttribute("disabled");
			act(() => {
				fireEvent.click(backButton);
			});

			expect(goSpy).toHaveBeenCalledWith(-1);

			// Select recipient
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
			expect(getByTestId("modal__inner")).toBeTruthy();

			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
			await waitFor(() =>
				expect(getByTestId("SelectRecipient__input")).toHaveValue(
					profile.contacts().values()[0].addresses().values()[0].address(),
				),
			);

			// Amount
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
			await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			await waitFor(() => expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge"));

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0.71538139"));

			// Step 2
			await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

			// Back to Step 1
			fireEvent.click(getByTestId("SendTransfer__button--back"));
			await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

			// Step 2
			await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

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

			await waitFor(() => expect(getByTestId("SendTransfer__button--submit")).not.toBeDisabled());
			fireEvent.click(getByTestId("SendTransfer__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
			await waitFor(() =>
				expect(getByTestId("TransactionSuccessful")).toHaveTextContent("8f913b6b719e7…f1b89abb49877"),
			);

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());

			// Go back to wallet
			const pushSpy = jest.spyOn(history, "push");
			fireEvent.click(getByTestId("SendTransfer__button--back-to-wallet"));
			expect(pushSpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);

			goSpy.mockRestore();
			pushSpy.mockRestore();

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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
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
			await waitFor(() => expect(getByTestId("AddRecipient__send-all")).toBeInTheDocument());
			fireEvent.click(getByTestId("AddRecipient__send-all"));
			await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"), { timeout: 4000 });

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

			// Step 2
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

			// Step 5 (skip step 4 for now - ledger confirmation)
			const signMock = jest
				.spyOn(wallet.transaction(), "signTransfer")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			fireEvent.click(getByTestId("SendTransfer__button--continue"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent("8f913b6b719e7…f1b89abb49877");

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

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});
		isMultiSignatureSpy.mockRestore();
		multisignatureSpy.mockRestore();
	});

	it("should send a single transfer with a ledger wallet", async () => {
		const isLedgerSpy = jest.spyOn(wallet, "isLedger").mockImplementation(() => true);
		const signTransactionSpy = jest
			.spyOn(wallet.coin().ledger(), "signTransaction")
			.mockImplementation(
				() =>
					new Promise((resolve) =>
						setTimeout(
							() =>
								resolve(
									"dd3f96466bc50077b01e441cd35eb3c5aabd83670d371c2be8cc772ed189a7315dd66e88bde275d89a3beb7ef85ef84a52ec4213f540481cd09ecf6d21e452bf",
								),
							300,
						),
					),
			);
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();

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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
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
			fireEvent.click(getByTestId("AddRecipient__send-all"));
			await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"), { timeout: 4000 });

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

			// Step 2
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

			// Step 3
			expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
			fireEvent.click(getByTestId("SendTransfer__button--continue"));

			// Auto broadcast
			await waitFor(() => expect(getByTestId("LedgerConfirmation-description")).toBeInTheDocument());
			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
		});

		broadcastMock.mockRestore();
		isLedgerSpy.mockRestore();
		signTransactionSpy.mockRestore();
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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
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
			fireEvent.click(getByTestId("AddRecipient__send-all"));
			await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"), { timeout: 4000 });

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0.71538139"));

			// Step 2
			expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

			// Step 3
			expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
			const passwordInput = getByTestId("AuthenticationStep__mnemonic");
			fireEvent.input(passwordInput, { target: { value: passphrase } });
			await waitFor(() => expect(passwordInput).toHaveValue(passphrase));

			// Step 5 (skip step 4 for now - ledger confirmation)
			const signMock = jest.spyOn(wallet.transaction(), "signTransfer").mockImplementation(() => {
				throw new Error("Signatory should be");
			});

			fireEvent.click(getByTestId("SendTransfer__button--submit"));

			await waitFor(() => expect(passwordInput).toHaveValue(""));
			await waitFor(() => {
				expect(getByTestId("Input-error")).toBeVisible();
			});

			signMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});

	it("should show error step and go back", async () => {
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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
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
			fireEvent.click(getByTestId("AddRecipient__send-all"));
			await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"), { timeout: 4000 });

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

			// Step 2
			expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

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
			const historyMock = jest.spyOn(history, "push").mockReturnValue();

			fireEvent.click(getByTestId("SendTransfer__button--submit"));

			await waitFor(() => expect(getByTestId("ErrorStep")).toBeInTheDocument());
			await waitFor(() => expect(getByTestId("ErrorStep__wallet-button")).toBeInTheDocument());
			await waitFor(() => expect(rendered.container).toMatchSnapshot());

			act(() => {
				fireEvent.click(getByTestId("ErrorStep__wallet-button"));
			});

			const walletDetailPage = `/profiles/${getDefaultProfileId()}/wallets/${getDefaultWalletId()}`;
			await waitFor(() => expect(historyMock).toHaveBeenCalledWith(walletDetailPage));

			signMock.mockRestore();
		});
	});

	it("should send a multi payment", async () => {
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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
		});

		const { getAllByTestId, getByTestId } = rendered!;

		await waitFor(() => {
			expect(rendered.getByTestId("SelectAddress__input")).toHaveValue(wallet.address());
			expect(rendered.getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name());
		});

		await utilsAct(async () => {
			// Select multiple tab
			fireEvent.click(getByTestId("AddRecipient__multi"));

			// Select recipient
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
			expect(getByTestId("SelectRecipient__input")).toHaveValue(
				profile.contacts().values()[0].addresses().values()[0].address(),
			);

			fireEvent.change(getByTestId("AddRecipient__amount"), { target: { value: "1" } });

			fireEvent.click(getByTestId("AddRecipient__add-button"));
			await waitFor(() => expect(getAllByTestId("recipient-list__recipient-list-item").length).toEqual(1));

			// Select recipient #2
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
			expect(getByTestId("SelectRecipient__input")).toHaveValue(
				profile.contacts().values()[0].addresses().values()[0].address(),
			);

			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
			expect(getByTestId("AddRecipient__amount")).toHaveValue("1");

			fireEvent.click(getByTestId("AddRecipient__add-button"));
			await waitFor(() => expect(getAllByTestId("recipient-list__recipient-list-item").length).toEqual(2));

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

			// Step 2
			expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

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

			coinMock.mockRestore();
			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});
	});

	it("should require amount if not set", async () => {
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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
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
			await waitFor(() =>
				expect(getByTestId("SelectRecipient__input")).toHaveValue(
					profile.contacts().values()[0].addresses().values()[0].address(),
				),
			);

			// Amount
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
			await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: " " } });
			await waitFor(() => expect(rendered.getByTestId("AddRecipient__amount")).toHaveAttribute("aria-invalid"));
		});
	});

	it("should send a single transfer and show unconfirmed transactions modal", async () => {
		const history = createMemoryHistory();
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

		//@ts-ignore
		const sentTransactionsMock = jest.spyOn(wallet, "sentTransactions").mockImplementation(() =>
			Promise.resolve({
				items: () => [
					{
						isTransfer: () => true,
						isMultiPayment: () => false,
						isConfirmed: () => false,
						timestamp: () => DateTime.make(),
						total: () => BigNumber.make(1),
						isSent: () => true,
						wallet: () => wallet,
						type: () => "transfer",
						recipient: () => "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
						recipients: () => ["D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb", wallet.address()],
						convertedTotal: () => BigNumber.ZERO,
						isVote: () => false,
						isUnvote: () => false,
					},
					{
						isTransfer: () => false,
						isMultiPayment: () => true,
						isConfirmed: () => false,
						timestamp: () => DateTime.make(),
						total: () => BigNumber.make(1),
						isSent: () => true,
						wallet: () => wallet,
						type: () => "multiPayment",
						recipient: () => "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
						recipients: () => ["D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb", wallet.address()],
						convertedTotal: () => BigNumber.ZERO,
						isVote: () => false,
						isUnvote: () => false,
					},
				],
			}),
		);

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

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
		});

		const { getAllByTestId, getByTestId } = rendered!;

		await act(async () => {
			await waitFor(() =>
				expect(rendered.getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()),
			);
			await waitFor(() => expect(rendered.getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

			const goSpy = jest.spyOn(history, "go").mockImplementation();

			const backButton = getByTestId("SendTransfer__button--back");
			expect(backButton).not.toHaveAttribute("disabled");
			act(() => {
				fireEvent.click(backButton);
			});

			expect(goSpy).toHaveBeenCalledWith(-1);

			// Select recipient
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
			expect(getByTestId("modal__inner")).toBeTruthy();

			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
			await waitFor(() =>
				expect(getByTestId("SelectRecipient__input")).toHaveValue(
					profile.contacts().values()[0].addresses().values()[0].address(),
				),
			);

			// Amount
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
			await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

			// Smartbridge
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			await waitFor(() => expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge"));

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0.71538139"));

			// Step 2
			await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

			// Back to Step 1
			fireEvent.click(getByTestId("SendTransfer__button--back"));
			await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

			// Step 2
			await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
			await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

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

			await waitFor(() => expect(getByTestId("SendTransfer__button--submit")).not.toBeDisabled());
			fireEvent.click(getByTestId("SendTransfer__button--submit"));

			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());
			fireEvent.click(getByTestId("ConfirmSendTransaction__cancel"));
			await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow());

			fireEvent.click(getByTestId("SendTransfer__button--submit"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());
			fireEvent.click(getByTestId("ConfirmSendTransaction__confirm"));
			await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow());

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
			await waitFor(() =>
				expect(getByTestId("TransactionSuccessful")).toHaveTextContent("8f913b6b719e7…f1b89abb49877"),
			);

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());

			// Go back to wallet
			const pushSpy = jest.spyOn(history, "push");
			fireEvent.click(getByTestId("SendTransfer__button--back-to-wallet"));
			expect(pushSpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);

			goSpy.mockRestore();
			pushSpy.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
		sentTransactionsMock.mockRestore();
	});
});
