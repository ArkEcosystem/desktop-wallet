/* eslint-disable @typescript-eslint/require-await */
import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { Profile, ProfileSetting, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { act as hookAct, renderHook } from "@testing-library/react-hooks";
import { LedgerProvider } from "app/contexts";
import { translations as transactionTranslations } from "domains/transaction/i18n";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import transactionFixture from "tests/fixtures/coins/ark/devnet/transactions/transfer.json";
import transactionMultipleFixture from "tests/fixtures/coins/ark/devnet/transactions/transfer-multiple.json";
import {
	act,
	env,
	fireEvent,
	getDefaultLedgerTransport,
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
		wallet = profile.wallets().first();

		nock("https://dwallets.ark.io")
			.get("/api/transactions?address=D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
			.reply(200, require("tests/fixtures/coins/ark/devnet/transactions.json"))
			.get("/api/transactions?page=1&limit=20&senderId=D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
			.reply(200, { meta: {}, data: [] });

		await syncFees();
	});

	it("should render form step", async () => {
		const { result: form } = renderHook(() => useForm());

		let rendered: RenderResult;

		await hookAct(async () => {
			rendered = render(
				<FormProvider {...form.current}>
					<FormStep networks={[]} profile={profile} />
				</FormProvider>,
			);
		});

		const { getByTestId, asFragment } = rendered;

		expect(getByTestId("SendTransfer__form-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render form step without test networks", async () => {
		const { result: form } = renderHook(() => useForm());

		const useNetworksMock = jest.spyOn(profile.settings(), "get").mockReturnValue(false);

		let rendered: RenderResult;

		await hookAct(async () => {
			rendered = render(
				<FormProvider {...form.current}>
					<FormStep networks={env.availableNetworks()} profile={profile} />
				</FormProvider>,
			);
		});

		const { getByTestId, asFragment } = rendered;

		expect(getByTestId("SendTransfer__form-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		useNetworksMock.mockRestore();
	});

	it("should render form step with deeplink values and use them", async () => {
		const { result: form } = renderHook(() => useForm());
		const deeplinkProps: any = {
			amount: "1.2",
			coin: "ark",
			memo: "ARK",
			method: "transfer",
			network: "ark.mainnet",
			recipient: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
		};

		await hookAct(async () => {
			const { getByTestId, asFragment } = render(
				<FormProvider {...form.current}>
					<FormStep networks={[]} profile={profile} deeplinkProps={deeplinkProps} />
				</FormProvider>,
			);

			expect(getByTestId("SendTransfer__form-step")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should render 1st step with custom deeplink values and use them", async () => {
		const { result: form } = renderHook(() => useForm());
		const deeplinkProps: any = {
			amount: "1.2",
			coin: "ark",
			method: "transfer",
			network: "ark.mainnet",
			recipient: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
		};

		let rendered: RenderResult;

		await hookAct(async () => {
			rendered = render(
				<FormProvider {...form.current}>
					<FormStep networks={[]} profile={profile} deeplinkProps={deeplinkProps} />
				</FormProvider>,
			);
		});

		const { getByTestId, asFragment } = rendered;

		expect(getByTestId("SendTransfer__form-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render review step", async () => {
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

	it("should render summary step", async () => {
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

	it("should render transfer form without selected wallet", async () => {
		const transferURL = `/profiles/${fixtureProfileId}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render form and use location state", async () => {
		const history = createMemoryHistory();
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${fixtureWalletId}/send-transfer`;
		history.push(transferURL, { memo: "ARK", coin: "ark", network: "ark.devnet" });

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
					<LedgerProvider transport={getDefaultLedgerTransport()}>
						<SendTransfer />
					</LedgerProvider>
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

	it("should render form and use location state without memo", async () => {
		const history = createMemoryHistory();

		const transferURL = `/profiles/${fixtureProfileId}/wallets/${fixtureWalletId}/send-transfer`;
		history.push(transferURL, { coin: "ark", network: "ark.devnet" });

		const { getByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should select cryptoasset first and see select address input clickable", async () => {
		const transferURL = `/profiles/${fixtureProfileId}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		await waitFor(() =>
			expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK Devnet"),
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should display disabled address selection input if selected cryptoasset has not available wallets", async () => {
		const transferURL = `/profiles/${fixtureProfileId}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		await waitFor(() =>
			expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK Devnet"),
		);
		expect(getByTestId("SelectAddress__wrapper")).not.toHaveAttribute("disabled");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a cryptoasset and select sender without wallet id param", async () => {
		const transferURL = `/profiles/${fixtureProfileId}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getByTestId, container } = renderWithRouter(
			<Route path="/profiles/:profileId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		// Select cryptoasset
		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		await waitFor(() =>
			expect(getByTestId("SelectNetworkInput__network")).toHaveAttribute("aria-label", "ARK Devnet"),
		);

		// Select sender
		act(() => {
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
		});
		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		const firstAddress = getByTestId("SearchWalletListItem__select-1");
		act(() => {
			fireEvent.click(firstAddress);
		});
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		await waitFor(() => expect(container).toMatchSnapshot());
	});

	it("should recalculate amount when fee changes and send all is selected", async () => {
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()));
		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});
		await waitFor(() =>
			expect(getByTestId("SelectDropdownInput__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		const sendAll = getByTestId("AddRecipient__send-all");
		act(() => {
			fireEvent.click(sendAll);
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"));
		act(() => {
			fireEvent.click(sendAll);
		});

		// Fee
		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});
		expect(getByTestId("InputCurrency")).toHaveValue("0.00357");

		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.AVERAGE));
		});
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0.07320598"));

		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.FAST));
		});
		expect(getByTestId("InputCurrency")).toHaveValue("0.1");
	});

	it("should handle fee change when send all is selected with zero balance", async () => {
		const emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		const emptyWallet = await emptyProfile.wallets().importByMnemonic("test", "ARK", "ark.devnet");

		const transferURL = `/profiles/${emptyProfile.id()}/wallets/${emptyWallet.id()}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(emptyWallet.address()));

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		expect(getByTestId("modal__inner")).toBeTruthy();

		// Amount
		const sendAll = getByTestId("AddRecipient__send-all");
		act(() => {
			fireEvent.click(sendAll);
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"));

		// Fee
		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});
		expect(getByTestId("InputCurrency")).toHaveValue("0.00357");

		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.AVERAGE));
		});
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0.07320598"));

		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.FAST));
		});
		expect(getByTestId("InputCurrency")).toHaveValue("0.1");
	});

	it("should send a single transfer", async () => {
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getAllByTestId, getByTestId, container } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()));
		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

		const goSpy = jest.spyOn(history, "go").mockImplementation();

		const backButton = getByTestId("SendTransfer__button--back");
		expect(backButton).not.toHaveAttribute("disabled");
		act(() => {
			fireEvent.click(backButton);
		});

		expect(goSpy).toHaveBeenCalledWith(-1);

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});
		await waitFor(() =>
			expect(getByTestId("SelectDropdownInput__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

		// Smartbridge
		act(() => {
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
		});
		await waitFor(() => expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge"));

		// Fee
		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});
		expect(getByTestId("InputCurrency")).toHaveValue("0.00357");

		// Step 2
		await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());
		await act(async () => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

		// Back to Step 1
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--back"));
		});
		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		// Step 2
		await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());
		await act(async () => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

		// Step 3
		expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
		await act(async () => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		act(() => {
			fireEvent.input(passwordInput, { target: { value: passphrase } });
		});
		await waitFor(() => expect(passwordInput).toHaveValue(passphrase));

		// Step 5 (skip step 4 for now - ledger confirmation)
		const signMock = jest
			.spyOn(wallet.transaction(), "signTransfer")
			.mockReturnValue(Promise.resolve(transactionFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await waitFor(() => expect(getByTestId("SendTransfer__button--submit")).not.toBeDisabled());
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--submit"));
		});

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent("8f913b6b719e7…f1b89abb49877"),
		);

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();

		await waitFor(() => expect(container).toMatchSnapshot());

		// Go back to wallet
		const pushSpy = jest.spyOn(history, "push");
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--back-to-wallet"));
		});
		expect(pushSpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);

		goSpy.mockRestore();
		pushSpy.mockRestore();

		await waitFor(() => expect(container).toMatchSnapshot());
	});

	it("should send a single transfer with a multisignature wallet", async () => {
		const isMultiSignatureSpy = jest.spyOn(wallet, "isMultiSignature").mockImplementation(() => true);
		const multisignatureSpy = jest
			.spyOn(wallet, "multiSignature")
			.mockReturnValue({ min: 2, publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!] });

		const transferURL = `/profiles/${fixtureProfileId}/transactions/${wallet.id()}/transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/transactions/:walletId/transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()));
		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});
		await waitFor(() =>
			expect(getByTestId("SelectDropdownInput__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		await waitFor(() => expect(getByTestId("AddRecipient__send-all")).toBeInTheDocument());
		act(() => {
			fireEvent.click(getByTestId("AddRecipient__send-all"));
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"), { timeout: 4000 });

		// Fee
		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});
		expect(getByTestId("InputCurrency")).toHaveValue("0.00357");

		// Step 2
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

		// Step 5 (skip step 4 for now - ledger confirmation)
		const signMock = jest
			.spyOn(wallet.transaction(), "signTransfer")
			.mockReturnValue(Promise.resolve(transactionFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
		expect(getByTestId("TransactionSuccessful")).toHaveTextContent("8f913b6b719e7…f1b89abb49877");

		expect(signMock).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.anything(),
				fee: "357000",
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
		isMultiSignatureSpy.mockRestore();
		multisignatureSpy.mockRestore();
	});

	it("should send a single transfer with a ledger wallet", async () => {
		const isLedgerSpy = jest.spyOn(wallet, "isLedger").mockImplementation(() => true);
		const getPublicKeySpy = jest
			.spyOn(wallet.coin().ledger(), "getPublicKey")
			.mockResolvedValue("0335a27397927bfa1704116814474d39c2b933aabb990e7226389f022886e48deb");
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

		const transferURL = `/profiles/${fixtureProfileId}/transactions/${wallet.id()}/transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/transactions/:walletId/transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()));
		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});
		await waitFor(() =>
			expect(getByTestId("SelectDropdownInput__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.click(getByTestId("AddRecipient__send-all"));
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"), { timeout: 4000 });

		// Smartbridge
		act(() => {
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
		});
		expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

		// Fee
		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});
		expect(getByTestId("InputCurrency")).toHaveValue("0.00357");

		// Step 2
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

		// Step 3
		expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});

		// Auto broadcast
		await waitFor(() => expect(getByTestId("LedgerConfirmation-description")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

		getPublicKeySpy.mockRestore();
		broadcastMock.mockRestore();
		isLedgerSpy.mockRestore();
		signTransactionSpy.mockRestore();
	});

	it("should return to form step by cancelling fee warning", async () => {
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getAllByTestId, getByTestId, container } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()));
		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});
		await waitFor(() =>
			expect(getByTestId("SelectDropdownInput__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

		// Smartbridge
		act(() => {
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
		});
		await waitFor(() => expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge"));

		// Fee
		act(() => {
			fireEvent.change(getByTestId("InputCurrency"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("1"));

		await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());
		await act(async () => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});

		// Review Step
		await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());
		expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});

		// Fee warning
		await waitFor(() => expect(getByTestId("FeeWarning__cancel-button")).toBeTruthy());
		await act(async () => {
			fireEvent.click(getByTestId("FeeWarning__cancel-button"));
		});
		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());
	});

	it.each(["cancel", "continue"])(
		"should update the profile settings when dismissing the fee warning (%s)",
		async (action) => {
			const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

			const history = createMemoryHistory();
			history.push(transferURL);

			const { getAllByTestId, getByTestId, container } = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
					<LedgerProvider transport={getDefaultLedgerTransport()}>
						<SendTransfer />
					</LedgerProvider>
				</Route>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

			await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()));
			await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

			// Select recipient
			act(() => {
				fireEvent.click(
					within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"),
				);
			});
			expect(getByTestId("modal__inner")).toBeTruthy();

			act(() => {
				fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
			});
			await waitFor(() =>
				expect(getByTestId("SelectDropdownInput__input")).toHaveValue(profile.wallets().first().address()),
			);

			// Amount
			act(() => {
				fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
			});
			await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

			// Smartbridge
			act(() => {
				fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
			});
			await waitFor(() => expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge"));

			// Fee
			act(() => {
				fireEvent.change(getByTestId("InputCurrency"), { target: { value: "1" } });
			});
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("1"));

			await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());
			await act(async () => {
				fireEvent.click(getByTestId("SendTransfer__button--continue"));
			});

			// Review Step
			await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());
			expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
			act(() => {
				fireEvent.click(getByTestId("SendTransfer__button--continue"));
			});

			const profileSpy = jest.spyOn(profile.settings(), "set").mockImplementation();

			// Fee warning
			await waitFor(() => expect(getByTestId("FeeWarning__suppressWarning-toggle")).toBeTruthy());
			await act(async () => {
				fireEvent.click(getByTestId("FeeWarning__suppressWarning-toggle"));
			});
			await act(async () => {
				fireEvent.click(getByTestId(`FeeWarning__${action}-button`));
			});

			expect(profileSpy).toHaveBeenCalledWith(ProfileSetting.DoNotShowFeeWarning, true);

			await waitFor(() =>
				expect(
					getByTestId(action === "cancel" ? "SendTransfer__form-step" : "AuthenticationStep"),
				).toBeTruthy(),
			);

			profileSpy.mockRestore();
		},
	);

	it.each([
		["high", "1"],
		["low", "0.000001"],
	])("should send a single transfer with a %s fee by confirming the fee warning", async (type, fee) => {
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getAllByTestId, getByTestId, container } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()));
		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});
		await waitFor(() =>
			expect(getByTestId("SelectDropdownInput__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

		// Smartbridge
		act(() => {
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
		});
		await waitFor(() => expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge"));

		// Fee
		act(() => {
			fireEvent.change(getByTestId("InputCurrency"), { target: { value: fee } });
		});
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue(fee));

		await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());
		await act(async () => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});

		// Review Step
		await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());
		expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});

		// Fee warning
		await waitFor(() => expect(getByTestId("FeeWarning__continue-button")).toBeTruthy());
		await act(async () => {
			fireEvent.click(getByTestId("FeeWarning__continue-button"));
		});

		// Auth Step
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		act(() => {
			fireEvent.input(passwordInput, { target: { value: passphrase } });
		});
		await waitFor(() => expect(passwordInput).toHaveValue(passphrase));

		// Summary Step (skip ledger confirmation for now)
		const signMock = jest
			.spyOn(wallet.transaction(), "signTransfer")
			.mockReturnValue(Promise.resolve(transactionFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await waitFor(() => expect(getByTestId("SendTransfer__button--submit")).not.toBeDisabled());
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--submit"));
		});

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent("8f913b6b719e7…f1b89abb49877"),
		);

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();

		await waitFor(() => expect(container).toMatchSnapshot());

		// Go back to wallet
		const pushSpy = jest.spyOn(history, "push");
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--back-to-wallet"));
		});
		expect(pushSpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);

		pushSpy.mockRestore();

		await waitFor(() => expect(container).toMatchSnapshot());
	});

	it("should error if wrong mnemonic", async () => {
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getAllByTestId, getByTestId, container } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()));
		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});
		expect(getByTestId("SelectDropdownInput__input")).toHaveValue(profile.wallets().first().address());

		// Amount
		act(() => {
			fireEvent.click(getByTestId("AddRecipient__send-all"));
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"), { timeout: 4000 });

		// Smartbridge
		act(() => {
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
		});
		expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

		// Fee
		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});
		expect(getByTestId("InputCurrency")).toHaveValue("0.00357");

		expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});

		// Review Step
		await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());
		expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});

		// Auth Step
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		act(() => {
			fireEvent.input(passwordInput, { target: { value: passphrase } });
		});
		await waitFor(() => expect(passwordInput).toHaveValue(passphrase));

		// Summary Step (skip ledger confirmation for now)
		const signMock = jest.spyOn(wallet.transaction(), "signTransfer").mockImplementation(() => {
			throw new Error("Signatory should be");
		});

		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--submit"));
		});

		await waitFor(() => expect(passwordInput).toHaveValue(""));
		await waitFor(() => {
			expect(getByTestId("Input-error")).toBeVisible();
		});

		signMock.mockRestore();

		await waitFor(() => expect(container).toMatchSnapshot());
	});

	it("should show error step and go back", async () => {
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getAllByTestId, getByTestId, container } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()));
		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});
		expect(getByTestId("SelectDropdownInput__input")).toHaveValue(profile.wallets().first().address());

		// Amount
		act(() => {
			fireEvent.click(getByTestId("AddRecipient__send-all"));
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"), { timeout: 4000 });

		// Smartbridge
		act(() => {
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
		});
		expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

		// Fee
		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});
		expect(getByTestId("InputCurrency")).toHaveValue("0.00357");

		// Step 2
		expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

		// Step 3
		expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		act(() => {
			fireEvent.input(passwordInput, { target: { value: passphrase } });
		});
		await waitFor(() => expect(passwordInput).toHaveValue(passphrase));

		// Step 5 (skip step 4 for now - ledger confirmation)
		const signMock = jest.spyOn(wallet.transaction(), "signTransfer").mockImplementation(() => {
			throw new Error();
		});
		const historyMock = jest.spyOn(history, "push").mockReturnValue();

		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--submit"));
		});

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

	it("should send a multi payment", async () => {
		nock("https://dwallets.ark.io")
			.get("/api/wallets/DFJ5Z51F1euNNdRUQJKQVdG4h495LZkc6T")
			.reply(200, require("tests/fixtures/coins/ark/devnet/wallets/DFJ5Z51F1euNNdRUQJKQVdG4h495LZkc6T.json"));

		nock("https://dwallets.ark.io")
			.get("/api/wallets/DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS")
			.reply(200, require("tests/fixtures/coins/ark/devnet/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb.json"));

		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		await waitFor(() => {
			expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address());
			expect(getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name());
		});

		// Select multiple tab
		act(() => {
			fireEvent.click(getByTestId("AddRecipient__multi"));
		});

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});
		expect(getByTestId("SelectDropdownInput__input")).toHaveValue(profile.wallets().first().address());

		act(() => {
			fireEvent.change(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});

		act(() => {
			fireEvent.click(getByTestId("AddRecipient__add-button"));
		});
		await waitFor(() => expect(getAllByTestId("recipient-list__recipient-list-item").length).toEqual(1));

		// Select recipient #2
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});
		expect(getByTestId("SelectDropdownInput__input")).toHaveValue(profile.wallets().first().address());

		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		expect(getByTestId("AddRecipient__amount")).toHaveValue("1");

		act(() => {
			fireEvent.click(getByTestId("AddRecipient__add-button"));
		});
		await waitFor(() => expect(getAllByTestId("recipient-list__recipient-list-item").length).toEqual(2));

		// Smartbridge
		act(() => {
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
		});
		expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge");

		// Fee
		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});
		expect(getByTestId("InputCurrency")).toHaveValue("0.00357");

		// Step 2
		expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

		// Step 3
		expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		act(() => {
			fireEvent.input(passwordInput, { target: { value: passphrase } });
		});
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
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--submit"));
		});

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

		coinMock.mockRestore();
		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should require amount if not set", async () => {
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()));
		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});
		await waitFor(() =>
			expect(getByTestId("SelectDropdownInput__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: " " } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveAttribute("aria-invalid"));
	});

	it("should send a single transfer and show unconfirmed transactions modal", async () => {
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

		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getAllByTestId, getByTestId, container } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				routes: [transferURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(wallet.network().name()));
		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

		const goSpy = jest.spyOn(history, "go").mockImplementation();

		const backButton = getByTestId("SendTransfer__button--back");
		expect(backButton).not.toHaveAttribute("disabled");
		act(() => {
			fireEvent.click(backButton);
		});

		expect(goSpy).toHaveBeenCalledWith(-1);

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});
		await waitFor(() =>
			expect(getByTestId("SelectDropdownInput__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

		// Smartbridge
		act(() => {
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } });
		});
		await waitFor(() => expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge"));

		// Fee
		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});
		expect(getByTestId("InputCurrency")).toHaveValue("0.00357");

		// Step 2
		await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

		// Back to Step 1
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--back"));
		});
		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		// Step 2
		await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

		// Step 3
		expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled();
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		act(() => {
			fireEvent.input(passwordInput, { target: { value: passphrase } });
		});
		await waitFor(() => expect(passwordInput).toHaveValue(passphrase));

		// Step 5 (skip step 4 for now - ledger confirmation)
		const signMock = jest
			.spyOn(wallet.transaction(), "signTransfer")
			.mockReturnValue(Promise.resolve(transactionFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await waitFor(() => expect(getByTestId("SendTransfer__button--submit")).not.toBeDisabled());
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--submit"));
		});

		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());
		act(() => {
			fireEvent.click(getByTestId("ConfirmSendTransaction__cancel"));
		});
		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow());

		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--submit"));
		});
		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());
		act(() => {
			fireEvent.click(getByTestId("ConfirmSendTransaction__confirm"));
		});
		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow());

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent("8f913b6b719e7…f1b89abb49877"),
		);

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();

		await waitFor(() => expect(container).toMatchSnapshot());

		// Go back to wallet
		const pushSpy = jest.spyOn(history, "push");
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--back-to-wallet"));
		});
		expect(pushSpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);

		goSpy.mockRestore();
		pushSpy.mockRestore();

		await waitFor(() => expect(container).toMatchSnapshot());
		sentTransactionsMock.mockRestore();
	});
});
