/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { SignMessage } from "./SignMessage";

const history = createMemoryHistory();
let walletUrl: string;

let profile: Profile;
let wallet: ReadWriteWallet;

const mnemonic = "this is a top secret password";

const transport: typeof Transport = createTransportReplayer(RecordStore.fromString(""));

describe("SignMessage", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = await profile.wallets().importByMnemonic(mnemonic, "ARK", "ark.devnet");

		walletUrl = `/profiles/${profile.id()}/wallets/${wallet.id()}`;
		history.push(walletUrl);
	});

	it("should render", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
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

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE),
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render for ledger wallets", async () => {
		const isLedgerMock = jest.spyOn(wallet, "isLedger").mockReturnValue(true);

		const { asFragment, getByTestId } = renderWithRouter(
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

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE),
		);

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

		const { getByTestId, asFragment } = renderWithRouter(
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

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE),
		);

		const messageInput = getByTestId("SignMessage__message-input");
		expect(messageInput).toBeTruthy();

		act(() => {
			fireEvent.input(messageInput, { target: { value: "Hello World" } });
		});

		const mnemonicInput = getByTestId("SignMessage__mnemonic-input");
		expect(mnemonicInput).toBeTruthy();

		act(() => {
			fireEvent.input(mnemonicInput, { target: { value: mnemonic } });
		});

		await waitFor(() => expect(getByTestId("SignMessage__submit-button")).toBeEnabled());

		act(() => {
			fireEvent.click(getByTestId("SignMessage__submit-button"));
		});

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SIGN_MESSAGE.SIGNED_STEP.TITLE),
		);

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

	it("should sign message with ledger wallet", async () => {
		const isLedgerMock = jest.spyOn(wallet, "isLedger").mockReturnValue(true);

		const signedMessage = {
			message: "Hello World",
			signatory: "0360e26c8ab14e1bebf4d5f36ab16dcefc9e7b9d9e000ae2470397eccdf1280f6f",
			signature:
				"b9791983a2b2b529dad23e0798cf4df30b3880f4fda5f4587f1c3171f02d0c9f4491f8c6d3e76b5cd2e2fd11c9fdcc7958e77d1f19c1b57a55e9c99ed1e6a2b1",
		};

		const { getByTestId, asFragment } = renderWithRouter(
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

		await waitFor(() =>
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE),
		);

		const messageInput = getByTestId("SignMessage__message-input");
		expect(messageInput).toBeTruthy();

		act(() => {
			fireEvent.input(messageInput, { target: { value: "Hello World" } });
		});

		await waitFor(() => expect(getByTestId("SignMessage__submit-button")).toBeEnabled());

		act(() => {
			fireEvent.click(getByTestId("SignMessage__submit-button"));
		});

		// TODO

		isLedgerMock.mockRestore();
	});
});
