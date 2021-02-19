/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
import { toasts } from "app/services";
import { translations as transactionTranslations } from "domains/transaction/i18n";
import { translations as walletTranslations } from "domains/wallet/i18n";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";

import { SignMessage } from "./SignMessage";

const history = createMemoryHistory();
let walletUrl: string;

let profile: Profile;
let wallet: ReadWriteWallet;

const mnemonic = "this is a top secret password";

let transport: typeof Transport;

describe("SignMessage", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = await profile.wallets().importByMnemonic(mnemonic, "ARK", "ark.devnet");

		walletUrl = `/profiles/${profile.id()}/wallets/${wallet.id()}`;
		history.push(walletUrl);
	});

	beforeEach(() => {
		jest.useFakeTimers();

		transport = createTransportReplayer(RecordStore.fromString(""));
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("should render", async () => {
		const { asFragment, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<LedgerProvider transport={transport}>
					<SignMessage isOpen={true} />
				</LedgerProvider>
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);

		await waitFor(() => expect(getByText(walletTranslations.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE)).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render for ledger wallets", async () => {
		const isLedgerMock = jest.spyOn(wallet, "isLedger").mockReturnValue(true);

		const { asFragment, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<LedgerProvider transport={transport}>
					<SignMessage isOpen={true} />
				</LedgerProvider>
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);

		await waitFor(() => expect(getByText(walletTranslations.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE)).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();

		isLedgerMock.mockRestore();
	});

	it("should sign message", async () => {
		const signedMessage = {
			message: "Hello World",
			signatory: "0360e26c8ab14e1bebf4d5f36ab16dcefc9e7b9d9e000ae2470397eccdf1280f6f",
			signature:
				"b9791983a2b2b529dad23e0798cf4df30b3880f4fda5f4587f1c3171f02d0c9f4491f8c6d3e76b5cd2e2fd11c9fdcc7958e77d1f19c1b57a55e9c99ed1e6a2b1",
		};

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<LedgerProvider transport={transport}>
					<SignMessage isOpen={true} />
				</LedgerProvider>
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);

		await waitFor(() => expect(getByText(walletTranslations.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE)).toBeTruthy());

		const messageInput = getByTestId("SignMessage__message-input");

		act(() => {
			fireEvent.input(messageInput, { target: { value: "Hello World" } });
		});

		const mnemonicInput = getByTestId("SignMessage__mnemonic-input");

		act(() => {
			fireEvent.input(mnemonicInput, { target: { value: mnemonic } });
		});

		await waitFor(() => expect(getByTestId("SignMessage__submit-button")).toBeEnabled());

		act(() => {
			fireEvent.click(getByTestId("SignMessage__submit-button"));
		});

		await waitFor(() => expect(getByText(walletTranslations.MODAL_SIGN_MESSAGE.SIGNED_STEP.TITLE)).toBeTruthy());

		const writeTextMock = jest.fn();
		const clipboardOriginal = navigator.clipboard;

		// @ts-ignore
		navigator.clipboard = { writeText: writeTextMock };

		act(() => {
			fireEvent.click(getByTestId("SignMessage__copy-button"));
		});

		await waitFor(() => expect(writeTextMock).toHaveBeenCalledWith(JSON.stringify(signedMessage)));

		// @ts-ignore
		navigator.clipboard = clipboardOriginal;
	});

	it("should return to form step", async () => {
		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<LedgerProvider transport={transport}>
					<SignMessage isOpen={true} />
				</LedgerProvider>
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);

		await waitFor(() => expect(getByText(walletTranslations.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE)).toBeTruthy());

		const messageInput = getByTestId("SignMessage__message-input");

		act(() => {
			fireEvent.input(messageInput, { target: { value: "Hello World" } });
		});

		const mnemonicInput = getByTestId("SignMessage__mnemonic-input");

		act(() => {
			fireEvent.input(mnemonicInput, { target: { value: mnemonic } });
		});

		await waitFor(() => expect(getByTestId("SignMessage__submit-button")).toBeEnabled());

		act(() => {
			fireEvent.click(getByTestId("SignMessage__submit-button"));
		});

		await waitFor(() => expect(getByText(walletTranslations.MODAL_SIGN_MESSAGE.SIGNED_STEP.TITLE)).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("SignMessage__back-button"));
		});

		await waitFor(() => expect(getByText(walletTranslations.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE)).toBeTruthy());
	});

	it("should sign message with ledger wallet", async () => {
		const isLedgerMock = jest.spyOn(wallet, "isLedger").mockReturnValue(true);

		const signedMessage = {
			message: "Hello World",
			signatory: "0360e26c8ab14e1bebf4d5f36ab16dcefc9e7b9d9e000ae2470397eccdf1280f6f",
			signature:
				"b9791983a2b2b529dad23e0798cf4df30b3880f4fda5f4587f1c3171f02d0c9f4491f8c6d3e76b5cd2e2fd11c9fdcc7958e77d1f19c1b57a55e9c99ed1e6a2b1",
		};

		const unsubscribe = jest.fn();
		let observer: Observer<any>;

		const listenSpy = jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe };
		});

		const signMessageSpy = jest
			.spyOn(wallet.coin().ledger(), "signMessage")
			.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve("signature"), 300)));

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<LedgerProvider transport={transport}>
					<SignMessage isOpen={true} />
				</LedgerProvider>
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);

		await waitFor(() => expect(getByText(walletTranslations.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE)).toBeTruthy());

		const messageInput = getByTestId("SignMessage__message-input");

		act(() => {
			fireEvent.input(messageInput, { target: { value: "Hello World" } });
		});

		await waitFor(() => expect(getByTestId("SignMessage__submit-button")).toBeEnabled());

		act(() => {
			fireEvent.click(getByTestId("SignMessage__submit-button"));
		});

		await waitFor(() => expect(getByTestId("LedgerWaitingDevice-loading_message")).toBeTruthy());

		act(() => {
			observer!.next({ type: "add", descriptor: "" });
		});

		await waitFor(() => expect(getByTestId("LedgerWaitingApp-loading_message")).toBeTruthy());

		const getPublicKeySpy = jest
			.spyOn(wallet.coin().ledger(), "getPublicKey")
			.mockResolvedValue(wallet.publicKey()!);

		await waitFor(() => expect(getByText(walletTranslations.MODAL_SIGN_MESSAGE.SIGNED_STEP.TITLE)).toBeTruthy());

		signMessageSpy.mockRestore();
		isLedgerMock.mockRestore();
		listenSpy.mockRestore();
		getPublicKeySpy.mockRestore();
	});

	it("should display error toast if user rejects", async () => {
		const toastSpy = jest.spyOn(toasts, "error");

		const isLedgerMock = jest.spyOn(wallet, "isLedger").mockReturnValue(true);

		const unsubscribe = jest.fn();
		let observer: Observer<any>;

		const listenSpy = jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe };
		});

		const signMessageSpy = jest
			.spyOn(wallet.coin().ledger(), "signMessage")
			.mockImplementation(
				() =>
					new Promise((_, reject) =>
						setTimeout(() => reject(new Error("Condition of use not satisfied")), 300),
					),
			);

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<LedgerProvider transport={transport}>
					<SignMessage isOpen={true} />
				</LedgerProvider>
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);

		await waitFor(() => expect(getByText(walletTranslations.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE)).toBeTruthy());

		const messageInput = getByTestId("SignMessage__message-input");

		act(() => {
			fireEvent.input(messageInput, { target: { value: "Hello World" } });
		});

		await waitFor(() => expect(getByTestId("SignMessage__submit-button")).toBeEnabled());

		act(() => {
			fireEvent.click(getByTestId("SignMessage__submit-button"));
		});

		await waitFor(() => expect(getByTestId("LedgerWaitingDevice-loading_message")).toBeTruthy());

		act(() => {
			observer!.next({ type: "add", descriptor: "" });
		});

		await waitFor(() => expect(getByTestId("LedgerWaitingApp-loading_message")).toBeTruthy());

		const getPublicKeySpy = jest
			.spyOn(wallet.coin().ledger(), "getPublicKey")
			.mockResolvedValue(wallet.publicKey()!);

		await waitFor(() =>
			expect(toastSpy).toHaveBeenCalledWith(transactionTranslations.LEDGER_CONFIRMATION.REJECTED),
		);

		toastSpy.mockRestore();
		signMessageSpy.mockRestore();
		isLedgerMock.mockRestore();
		listenSpy.mockRestore();
		getPublicKeySpy.mockRestore();
	});

	it("should display error toast if ledger is not found in time", async () => {
		const toastSpy = jest.spyOn(toasts, "error");

		const isLedgerMock = jest.spyOn(wallet, "isLedger").mockReturnValue(true);

		const unsubscribe = jest.fn();
		let observer: Observer<any>;

		const listenSpy = jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe };
		});

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<LedgerProvider transport={transport}>
					<SignMessage isOpen={true} />
				</LedgerProvider>
			</Route>,
			{
				routes: [walletUrl],
				history,
			},
		);

		const transportSpy = jest
			.spyOn(transport, "open")
			.mockImplementation(
				() => new Promise((_, reject) => setTimeout(() => reject(new Error("no device found")), 300)),
			);

		await waitFor(() => expect(getByText(walletTranslations.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE)).toBeTruthy());

		const messageInput = getByTestId("SignMessage__message-input");

		act(() => {
			fireEvent.input(messageInput, { target: { value: "Hello World" } });
		});

		await waitFor(() => expect(getByTestId("SignMessage__submit-button")).toBeEnabled());

		act(() => {
			fireEvent.click(getByTestId("SignMessage__submit-button"));
		});

		// await waitFor(() =>
		//  expect(toastSpy).toHaveBeenCalledWith(walletTranslations.MODAL_LEDGER_WALLET.NO_DEVICE_FOUND),
		// );

		toastSpy.mockRestore();
		transportSpy.mockRestore();
		isLedgerMock.mockRestore();
		listenSpy.mockRestore();
	});
});
