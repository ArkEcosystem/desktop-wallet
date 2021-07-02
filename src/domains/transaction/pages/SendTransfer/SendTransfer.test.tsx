/* eslint-disable @typescript-eslint/require-await */
import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { screen } from "@testing-library/react";
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

import { FormStep } from "./FormStep";
import { NetworkStep } from "./NetworkStep";
import { ReviewStep } from "./ReviewStep";
import { SendTransfer } from "./SendTransfer";
import { SummaryStep } from "./SummaryStep";

const passphrase = getDefaultWalletMnemonic();
const fixtureProfileId = getDefaultProfileId();
const fixtureWalletId = getDefaultWalletId();

const createTransactionMultipleMock = (wallet: Contracts.IReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		amount: () => +transactionMultipleFixture.data.amount / 1e8,
		data: () => ({ data: () => transactionMultipleFixture.data }),
		explorerLink: () => `https://dexplorer.ark.io/transaction/${transactionFixture.data.id}`,
		fee: () => +transactionMultipleFixture.data.fee / 1e8,
		id: () => transactionMultipleFixture.data.id,
		recipient: () => transactionMultipleFixture.data.recipient,
		recipients: () => [
			{
				address: transactionMultipleFixture.data.recipient,
				amount: +transactionMultipleFixture.data.amount / 1e8,
			},
		],
		sender: () => transactionMultipleFixture.data.sender,
		type: () => "multiPayment",
	});

const createTransactionMock = (wallet: Contracts.IReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		amount: () => +transactionFixture.data.amount / 1e8,
		data: () => ({ data: () => transactionFixture.data }),
		explorerLink: () => `https://dexplorer.ark.io/transaction/${transactionFixture.data.id}`,
		fee: () => +transactionFixture.data.fee / 1e8,
		id: () => transactionFixture.data.id,
		recipient: () => transactionFixture.data.recipient,
		recipients: () => [
			{
				address: transactionFixture.data.recipient,
				amount: +transactionFixture.data.amount / 1e8,
			},
		],
		sender: () => transactionFixture.data.sender,
		type: () => "transfer",
	});

let profile: Contracts.IProfile;
let wallet: Contracts.IReadWriteWallet;

describe("SendTransfer", () => {
	beforeAll(async () => {
		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");

		await env.profiles().restore(profile);
		await profile.sync();

		wallet = profile.wallets().first();

		nock("https://dwallets.ark.io")
			.get("/api/transactions?address=D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
			.reply(200, require("tests/fixtures/coins/ark/devnet/transactions.json"))
			.get("/api/transactions?page=1&limit=20&senderId=D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
			.reply(200, { data: [], meta: {} })
			.get("/api/transactions/8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877")
			.reply(200, () => require("tests/fixtures/coins/ark/devnet/transactions.json"));

		await syncFees(profile);
	});

	it("should render form step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					senderAddress: wallet.address(),
				},
			}),
		);

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
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					senderAddress: wallet.address(),
				},
			}),
		);

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

	it("should render network step without test networks", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					senderAddress: wallet.address(),
				},
			}),
		);

		const useNetworksMock = jest.spyOn(profile.settings(), "get").mockReturnValue(false);

		let rendered: RenderResult;

		await hookAct(async () => {
			rendered = render(
				<FormProvider {...form.current}>
					<NetworkStep networks={env.availableNetworks()} profile={profile} />
				</FormProvider>,
			);
		});

		const { getByTestId, asFragment } = rendered;

		expect(getByTestId("SendTransfer__network-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		useNetworksMock.mockRestore();
	});

	it("should render form step with deeplink values and use them", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					senderAddress: wallet.address(),
				},
			}),
		);
		const deeplinkProperties: any = {
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
					<FormStep networks={[]} profile={profile} deeplinkProps={deeplinkProperties} />
				</FormProvider>,
			);

			expect(getByTestId("SendTransfer__form-step")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should render 1st step with custom deeplink values and use them", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					senderAddress: wallet.address(),
				},
			}),
		);
		const deeplinkProperties: any = {
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
					<FormStep networks={[]} profile={profile} deeplinkProps={deeplinkProperties} />
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
					fee: "1",
					memo: "test memo",
					recipients: [
						{
							address: wallet.address(),
							amount: BigNumber.make(1),
						},
					],
					senderAddress: wallet.address(),
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
		expect(container).toHaveTextContent("D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD");
		expect(container).toHaveTextContent("test memo");

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render summary step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					senderAddress: wallet.address(),
				},
			}),
		);
		await wallet.synchroniser().identity();

		const transaction = new DTO.ExtendedSignedTransactionData(
			await wallet
				.coin()
				.transaction()
				.transfer({
					data: {
						amount: "1",
						to: wallet.address(),
					},
					fee: "1",
					nonce: "1",
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
			wallet,
		);

		const { getByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<SummaryStep transaction={transaction} senderWallet={wallet} />
			</FormProvider>,
		);

		expect(getByTestId("TransactionSuccessful")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render network selection without selected wallet", async () => {
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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__network-step")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render form and use location state", async () => {
		const history = createMemoryHistory();
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${fixtureWalletId}/send-transfer?recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&memo=ARK&coin=ark&network=ark.devnet`;
		history.push(transferURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
					<LedgerProvider transport={getDefaultLedgerTransport()}>
						<SendTransfer />
					</LedgerProvider>
				</Route>,
				{
					history,
					routes: [transferURL],
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SendTransfer__form-step")).toBeTruthy());
		});

		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it("should render form and use location state without memo", async () => {
		const history = createMemoryHistory();

		const transferURL = `/profiles/${fixtureProfileId}/wallets/${fixtureWalletId}/send-transfer?coin=ark&network=ark.devnet`;
		history.push(transferURL);

		const { getByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should select cryptoasset", async () => {
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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__network-step")).toBeTruthy());

		const input = getByTestId("SelectNetworkInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "no match" } });
		});

		await waitFor(async () => {
			expect(input).toHaveAttribute("aria-invalid", "true");
		});

		act(() => {
			fireEvent.change(input, { target: { value: "ARK Dev" } });
		});

		await waitFor(async () => {
			expect(input).not.toHaveAttribute("aria-invalid");
		});

		act(() => {
			fireEvent.change(input, { target: { value: "" } });
		});

		await waitFor(async () => {
			expect(input).toHaveAttribute("aria-invalid");
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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__network-step")).toBeTruthy());

		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());

		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__network-step")).toBeTruthy());

		// Select cryptoasset
		act(() => {
			fireEvent.focus(getByTestId("SelectNetworkInput__input"));
		});

		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-ark.devnet")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("NetworkIcon-ARK-ark.devnet"));
		});

		await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());

		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
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
			expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		const sendAll = getByTestId("AddRecipient__send-all");
		act(() => {
			fireEvent.click(sendAll);
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"));

		expect(screen.getByTestId("AddRecipient__send-all")).toHaveClass("active");

		act(() => {
			fireEvent.click(sendAll);
		});

		expect(screen.getByTestId("AddRecipient__send-all")).not.toHaveClass("active");

		// Fee
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});

		expect(screen.getAllByRole("radio")[0]).toBeChecked();
		expect(screen.getAllByRole("radio")[0]).toHaveTextContent("0.00357");

		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.AVERAGE));
		});

		expect(screen.getAllByRole("radio")[1]).toBeChecked();
		expect(screen.getAllByRole("radio")[1]).toHaveTextContent("0.07320598");

		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.FAST));
		});

		expect(screen.getAllByRole("radio")[2]).toBeChecked();
		expect(screen.getAllByRole("radio")[2]).toHaveTextContent("0.1");
	});

	it("should handle fee change", async () => {
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${fixtureWalletId}/send-transfer?coin=ark&network=ark.devnet`;

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

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
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});

		expect(screen.getAllByRole("radio")[0]).toBeChecked();
		expect(screen.getAllByRole("radio")[0]).toHaveTextContent("0.00357");

		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.AVERAGE));
		});

		expect(screen.getAllByRole("radio")[1]).toBeChecked();
		expect(screen.getAllByRole("radio")[1]).toHaveTextContent("0.07320598");

		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.FAST));
		});

		expect(screen.getAllByRole("radio")[2]).toBeChecked();
		expect(screen.getAllByRole("radio")[2]).toHaveTextContent("0.1");

		act(() => {
			fireEvent.click(
				within(getByTestId("InputFee")).getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED),
			);
		});

		await act(async () => {
			fireEvent.change(getByTestId("InputCurrency"), { target: { value: "1000000000" } });
		});

		expect(getByTestId("InputCurrency")).toHaveValue("1000000000");
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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
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
			expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

		// Memo
		act(() => {
			fireEvent.input(getByTestId("Input__memo"), { target: { value: "test memo" } });
		});
		await waitFor(() => expect(getByTestId("Input__memo")).toHaveValue("test memo"));

		// Fee
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});

		expect(screen.getAllByRole("radio")[0]).toBeChecked();
		expect(screen.getAllByRole("radio")[0]).toHaveTextContent("0.00357");

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

		expect(screen.getAllByRole("radio")[0]).toBeChecked();

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
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [transactionFixture.data.id],
			errors: {},
			rejected: [],
		});
		const transactionMock = createTransactionMock(wallet);

		await waitFor(() => expect(getByTestId("SendTransfer__button--submit")).not.toBeDisabled());
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--submit"));
		});

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent(
				"8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877",
			),
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

	it("should fail sending a single transfer", async () => {
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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
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
			expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

		// Memo
		act(() => {
			fireEvent.input(getByTestId("Input__memo"), { target: { value: "test memo" } });
		});
		await waitFor(() => expect(getByTestId("Input__memo")).toHaveValue("test memo"));

		// Fee
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});

		expect(screen.getAllByRole("radio")[0]).toBeChecked();
		expect(screen.getAllByRole("radio")[0]).toHaveTextContent("0.00357");

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
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [],
			//@ts-ignore
			errors: { [transactionFixture.data.id]: "ERROR" },

			rejected: [transactionFixture.data.id],
		});
		const transactionMock = createTransactionMock(wallet);

		await waitFor(() => expect(getByTestId("SendTransfer__button--submit")).not.toBeDisabled());
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--submit"));
		});

		await waitFor(() => expect(getByTestId("ErrorStep")).toBeTruthy());

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should send a single transfer and handle undefined expiration", async () => {
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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
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
			expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

		// Memo
		act(() => {
			fireEvent.input(getByTestId("Input__memo"), { target: { value: "test memo" } });
		});
		await waitFor(() => expect(getByTestId("Input__memo")).toHaveValue("test memo"));

		// Fee
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});

		expect(screen.getAllByRole("radio")[0]).toBeChecked();
		expect(screen.getAllByRole("radio")[0]).toHaveTextContent("0.00357");

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
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [transactionFixture.data.id],
			errors: {},
			rejected: [],
		});
		const transactionMock = createTransactionMock(wallet);
		const expirationMock = jest
			.spyOn(wallet.coin().transaction(), "estimateExpiration")
			.mockResolvedValue(undefined);

		await waitFor(() => expect(getByTestId("SendTransfer__button--submit")).not.toBeDisabled());
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--submit"));
		});

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent(
				"8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877",
			),
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
		expirationMock.mockRestore();

		await waitFor(() => expect(container).toMatchSnapshot());
	});

	it("should send a single transfer with a multisignature wallet", async () => {
		const isMultiSignatureSpy = jest.spyOn(wallet, "isMultiSignature").mockImplementation(() => true);
		const multisignatureSpy = jest
			.spyOn(wallet.multiSignature(), "all")
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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
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
			expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		await waitFor(() => expect(getByTestId("AddRecipient__send-all")).toBeInTheDocument());
		act(() => {
			fireEvent.click(getByTestId("AddRecipient__send-all"));
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"), { timeout: 4000 });

		// Fee
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});

		expect(screen.getAllByRole("radio")[0]).toBeChecked();
		expect(screen.getAllByRole("radio")[0]).toHaveTextContent("0.00357");

		// Step 2
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

		// Step 5 (skip step 4 for now - ledger confirmation)
		const signMock = jest
			.spyOn(wallet.transaction(), "signTransfer")
			.mockReturnValue(Promise.resolve(transactionFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [transactionFixture.data.id],
			errors: {},
			rejected: [],
		});
		const transactionMock = createTransactionMock(wallet);

		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

		expect(getByTestId("TransactionSuccessful")).toHaveTextContent(
			"8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877",
		);

		expect(signMock).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.anything(),
				fee: expect.any(Number),
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

	it("should send a single transfer with a ledger wallet", async () => {
		jest.useFakeTimers();
		const isLedgerSpy = jest.spyOn(wallet, "isLedger").mockImplementation(() => true);
		jest.spyOn(wallet.coin(), "__construct").mockImplementation();

		const getPublicKeySpy = jest
			.spyOn(wallet.coin().ledger(), "getPublicKey")
			.mockResolvedValue("0335a27397927bfa1704116814474d39c2b933aabb990e7226389f022886e48deb");

		const signTransactionSpy = jest
			.spyOn(wallet.transaction(), "signTransfer")
			.mockReturnValue(Promise.resolve(transactionFixture.data.id));

		const transactionMock = createTransactionMock(wallet);

		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [transactionFixture.data.id],
			errors: {},
			rejected: [],
		});

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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
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
			expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.click(getByTestId("AddRecipient__send-all"));
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"), { timeout: 4000 });

		// Memo
		act(() => {
			fireEvent.input(getByTestId("Input__memo"), { target: { value: "test memo" } });
		});

		expect(getByTestId("Input__memo")).toHaveValue("test memo");

		// Fee
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});

		expect(screen.getAllByRole("radio")[0]).toBeChecked();
		expect(screen.getAllByRole("radio")[0]).toHaveTextContent("0.00357");

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
		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

		getPublicKeySpy.mockRestore();
		broadcastMock.mockRestore();
		isLedgerSpy.mockRestore();
		signTransactionSpy.mockRestore();
		transactionMock.mockRestore();
	});

	it("should return to form step by cancelling fee warning", async () => {
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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
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
			expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

		// Memo
		act(() => {
			fireEvent.input(getByTestId("Input__memo"), { target: { value: "test memo" } });
		});
		await waitFor(() => expect(getByTestId("Input__memo")).toHaveValue("test memo"));

		// Fee
		act(() => {
			fireEvent.click(
				within(getByTestId("InputFee")).getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED),
			);
		});
		act(() => {
			fireEvent.change(getByTestId("InputCurrency"), { target: { value: "" } });
		});
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue(""));

		await waitFor(() => {
			expect(getByTestId("Input__error")).toBeVisible();
		});

		act(() => {
			fireEvent.change(getByTestId("InputCurrency"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("1"));

		await waitFor(() => expect(() => getByTestId("Input__error")).toThrow());

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

			const { getAllByTestId, getByTestId } = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
					<LedgerProvider transport={getDefaultLedgerTransport()}>
						<SendTransfer />
					</LedgerProvider>
				</Route>,
				{
					history,
					routes: [transferURL],
				},
			);

			await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

			const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
			await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
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
				expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address()),
			);

			// Amount
			act(() => {
				fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
			});
			await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

			// Memo
			act(() => {
				fireEvent.input(getByTestId("Input__memo"), { target: { value: "test memo" } });
			});
			await waitFor(() => expect(getByTestId("Input__memo")).toHaveValue("test memo"));

			// Fee
			act(() => {
				fireEvent.click(
					within(getByTestId("InputFee")).getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED),
				);
			});
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

			expect(profileSpy).toHaveBeenCalledWith(Contracts.ProfileSetting.DoNotShowFeeWarning, true);

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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
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
			expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

		// Memo
		act(() => {
			fireEvent.input(getByTestId("Input__memo"), { target: { value: "test memo" } });
		});
		await waitFor(() => expect(getByTestId("Input__memo")).toHaveValue("test memo"));

		// Fee
		act(() => {
			fireEvent.click(
				within(getByTestId("InputFee")).getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED),
			);
		});
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
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [transactionFixture.data.id],
			errors: {},
			rejected: [],
		});
		const transactionMock = createTransactionMock(wallet);

		await waitFor(() => expect(getByTestId("SendTransfer__button--submit")).not.toBeDisabled());
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--submit"));
		});

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent(
				"8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877",
			),
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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});

		expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address());

		// Amount
		act(() => {
			fireEvent.click(getByTestId("AddRecipient__send-all"));
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"), { timeout: 4000 });

		// Memo
		act(() => {
			fireEvent.input(getByTestId("Input__memo"), { target: { value: "test memo" } });
		});

		expect(getByTestId("Input__memo")).toHaveValue("test memo");

		// Fee
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});

		expect(screen.getAllByRole("radio")[0]).toBeChecked();
		expect(screen.getAllByRole("radio")[0]).toHaveTextContent("0.00357");

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

		const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => undefined);
		// Summary Step (skip ledger confirmation for now)
		const signMock = jest.spyOn(wallet.transaction(), "signTransfer").mockImplementation(() => {
			throw new Error("Signatory should be");
		});

		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--submit"));
		});

		await waitFor(() => expect(signMock).toHaveBeenCalled());
		await waitFor(() => expect(passwordInput).toHaveValue(""));
		await waitFor(() => {
			expect(getByTestId("Input__error")).toBeVisible();
		});

		signMock.mockRestore();
		consoleErrorMock.mockRestore();

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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});

		expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address());

		// Amount
		act(() => {
			fireEvent.click(getByTestId("AddRecipient__send-all"));
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).not.toHaveValue("0"), { timeout: 4000 });

		// Memo
		act(() => {
			fireEvent.input(getByTestId("Input__memo"), { target: { value: "test memo" } });
		});

		expect(getByTestId("Input__memo")).toHaveValue("test memo");

		// Fee
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});

		expect(screen.getAllByRole("radio")[0]).toBeChecked();
		expect(screen.getAllByRole("radio")[0]).toHaveTextContent("0.00357");

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

		const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => undefined);
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
		// Display error details with copy button
		await waitFor(() => expect(getByTestId("ErrorStep__errorMessage")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("clipboard-button__wrapper")).toBeInTheDocument());
		await waitFor(() => expect(container).toMatchSnapshot());

		act(() => {
			fireEvent.click(getByTestId("ErrorStep__wallet-button"));
		});

		const walletDetailPage = `/profiles/${getDefaultProfileId()}/wallets/${getDefaultWalletId()}`;
		await waitFor(() => expect(historyMock).toHaveBeenCalledWith(walletDetailPage));

		signMock.mockRestore();
		consoleErrorMock.mockRestore();
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

		const { getAllByTestId, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => {
			expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address());
			expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel);
		});

		// Select multiple type
		act(() => {
			fireEvent.click(getByText(transactionTranslations.MULTIPLE));
		});

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});
		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});

		expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address());

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

		expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address());

		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});

		expect(getByTestId("AddRecipient__amount")).toHaveValue("1");

		act(() => {
			fireEvent.click(getByTestId("AddRecipient__add-button"));
		});
		await waitFor(() => expect(getAllByTestId("recipient-list__recipient-list-item").length).toEqual(2));

		// Memo
		act(() => {
			fireEvent.input(getByTestId("Input__memo"), { target: { value: "test memo" } });
		});

		expect(getByTestId("Input__memo")).toHaveValue("test memo");

		// Fee
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});

		expect(screen.getAllByRole("radio")[0]).toBeChecked();
		expect(screen.getAllByRole("radio")[0]).toHaveTextContent("0.00357");

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
		const coin = profile.coins().set("ARK", "ark.devnet");
		const coinMock = jest.spyOn(coin.address(), "validate").mockReturnValue(true);

		const signMock = jest
			.spyOn(wallet.transaction(), "signMultiPayment")
			.mockReturnValue(Promise.resolve(transactionMultipleFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [transactionFixture.data.id],
			errors: {},
			rejected: [],
		});
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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
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
			expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address()),
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
		const sentTransactionsMock = jest.spyOn(wallet.transactionIndex(), "sent").mockImplementation(() =>
			Promise.resolve({
				items: () => [
					{
						convertedTotal: () => 0,
						isConfirmed: () => false,
						isMultiPayment: () => false,
						isSent: () => true,
						isTransfer: () => true,
						isUnvote: () => false,
						isVote: () => false,
						recipient: () => "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
						recipients: () => ["D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb", wallet.address()],
						timestamp: () => DateTime.make(),
						total: () => 1,
						type: () => "transfer",
						wallet: () => wallet,
					},
					{
						convertedTotal: () => 0,
						isConfirmed: () => false,
						isMultiPayment: () => true,
						isSent: () => true,
						isTransfer: () => false,
						isUnvote: () => false,
						isVote: () => false,
						recipient: () => "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
						recipients: () => ["D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb", wallet.address()],
						timestamp: () => DateTime.make(),
						total: () => 1,
						type: () => "multiPayment",
						wallet: () => wallet,
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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
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
			expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

		// Memo
		act(() => {
			fireEvent.input(getByTestId("Input__memo"), { target: { value: "test memo" } });
		});
		await waitFor(() => expect(getByTestId("Input__memo")).toHaveValue("test memo"));

		// Fee
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});

		expect(screen.getAllByRole("radio")[0]).toBeChecked();
		expect(screen.getAllByRole("radio")[0]).toHaveTextContent("0.00357");

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
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [transactionFixture.data.id],
			errors: {},
			rejected: [],
		});
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
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent(
				"8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877",
			),
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

	it("should display unconfirmed transactions modal when submitting with Enter", async () => {
		const sentTransactionsMock = jest.spyOn(wallet.transactionIndex(), "sent").mockImplementation(() =>
			Promise.resolve<any>({
				items: () => [
					{
						convertedTotal: () => 0,
						isConfirmed: () => false,
						isMultiPayment: () => false,
						isSent: () => true,
						isTransfer: () => true,
						isUnvote: () => false,
						isVote: () => false,
						recipient: () => "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
						recipients: () => ["D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb", wallet.address()],
						timestamp: () => DateTime.make(),
						total: () => 1,
						type: () => "transfer",
						wallet: () => wallet,
					},
				],
			}),
		);

		const signMock = jest
			.spyOn(wallet.transaction(), "signTransfer")
			.mockReturnValue(Promise.resolve(transactionFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [transactionFixture.data.id],
			errors: {},
			rejected: [],
		});
		const transactionMock = createTransactionMock(wallet);

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
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
		await waitFor(() => expect(getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

		// select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-recipient"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});
		await waitFor(() =>
			expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address()),
		);

		// enter amount
		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

		// Fee
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});

		expect(screen.getAllByRole("radio")[0]).toBeChecked();
		expect(screen.getAllByRole("radio")[0]).toHaveTextContent("0.00357");

		await waitFor(() => expect(getByTestId("SendTransfer__button--continue")).not.toBeDisabled());

		// proceed to step 2
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("SendTransfer__review-step")).toBeTruthy());

		// proceed to step 3
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--continue"));
		});
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		// enter mnemonic
		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		act(() => {
			fireEvent.input(passwordInput, { target: { value: passphrase } });
		});
		await waitFor(() => expect(passwordInput).toHaveValue(passphrase));
		await waitFor(() => expect(getByTestId("SendTransfer__button--submit")).not.toBeDisabled());

		// submit form
		act(() => {
			fireEvent.submit(getByTestId("Form"));
		});
		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		// confirm within the modal
		act(() => {
			fireEvent.click(getByTestId("ConfirmSendTransaction__confirm"));
		});
		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow());

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent(
				"8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877",
			),
		);

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
		sentTransactionsMock.mockRestore();

		await waitFor(() => expect(container).toMatchSnapshot());
	});

	it("should send a single transfer using wallet with encryption password", async () => {
		const transferURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-transfer`;
		const actsWithMnemonicMock = jest.spyOn(wallet, "actsWithMnemonic").mockReturnValue(false);
		const actsWithWifWithEncryptionMock = jest.spyOn(wallet, "actsWithWifWithEncryption").mockReturnValue(true);
		const wifGetMock = jest
			.spyOn(wallet.wif(), "get")
			.mockResolvedValue("S9rDfiJ2ar4DpWAQuaXECPTJHfTZ3XjCPv15gjxu4cHJZKzABPyV");

		const history = createMemoryHistory();
		history.push(transferURL);

		const { getAllByTestId, getByTestId, container } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-transfer">
				<LedgerProvider transport={getDefaultLedgerTransport()}>
					<SendTransfer />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [transferURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendTransfer__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("SelectNetworkInput__input")).toHaveValue(networkLabel));
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
			expect(getByTestId("SelectDropdown__input")).toHaveValue(profile.wallets().first().address()),
		);

		// Amount
		act(() => {
			fireEvent.input(getByTestId("AddRecipient__amount"), { target: { value: "1" } });
		});
		await waitFor(() => expect(getByTestId("AddRecipient__amount")).toHaveValue("1"));

		// Memo
		act(() => {
			fireEvent.input(getByTestId("Input__memo"), { target: { value: "test memo" } });
		});
		await waitFor(() => expect(getByTestId("Input__memo")).toHaveValue("test memo"));

		// Fee
		await act(async () => {
			fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.FEES.SLOW));
		});

		expect(screen.getAllByRole("radio")[0]).toBeChecked();
		expect(screen.getAllByRole("radio")[0]).toHaveTextContent("0.00357");

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
		const passwordInput = getByTestId("AuthenticationStep__encryption-password");
		act(() => {
			fireEvent.input(passwordInput, { target: { value: "password" } });
		});
		await waitFor(() => expect(passwordInput).toHaveValue("password"));

		// Step 5 (skip step 4 for now - ledger confirmation)
		const signMock = jest
			.spyOn(wallet.transaction(), "signTransfer")
			.mockReturnValue(Promise.resolve(transactionFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [transactionFixture.data.id],
			errors: {},
			rejected: [],
		});
		const transactionMock = createTransactionMock(wallet);

		await waitFor(() => expect(getByTestId("SendTransfer__button--submit")).not.toBeDisabled());
		act(() => {
			fireEvent.click(getByTestId("SendTransfer__button--submit"));
		});

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent(
				"8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877",
			),
		);

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
		actsWithMnemonicMock.mockRestore();
		actsWithWifWithEncryptionMock.mockRestore();
		wifGetMock.mockRestore();

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
});
