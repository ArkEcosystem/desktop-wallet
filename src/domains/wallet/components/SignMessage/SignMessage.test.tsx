/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import nock from "nock";
import React from "react";
import { act, fireEvent, render, RenderResult, waitFor } from "testing-library";
import { profiles } from "tests/fixtures/env/data";
import { identity } from "tests/fixtures/identity";
import { StubStorage } from "tests/mocks";

import { translations } from "../../i18n";
import { SignMessage } from "./SignMessage";

let env: Environment;
let profile: Profile;
let wallet: Wallet;

describe("SignMessage", () => {
	beforeAll(() => {
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/node/configuration")
			.reply(200, require("../../../../tests/fixtures/coins/ark/configuration-devnet.json"))
			.get("/api/peers")
			.reply(200, require("../../../../tests/fixtures/coins/ark/peers.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, require("../../../../tests/fixtures/coins/ark/cryptoConfiguration.json"))
			.get("/api/node/syncing")
			.reply(200, require("../../../../tests/fixtures/coins/ark/syncing.json"))
			.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
			.reply(200, require("../../../../tests/fixtures/coins/ark/wallet.json"))
			.persist();
	});

	beforeEach(async () => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

		await env.bootFromObject({ data: {}, profiles });

		profile = env.profiles().findById("bob");

		wallet = await profile.wallets().importByMnemonic(identity.mnemonic, "ARK", "devnet");
	});

	it("should render", () => {
		const { asFragment } = render(
			<EnvironmentProvider env={env}>
				<SignMessage
					profileId={profile.id()}
					walletId={wallet.id()}
					signatoryAddress="D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib"
					isOpen={true}
				/>
			</EnvironmentProvider>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should sign message", async () => {
		const signedMessage = {
			message: "Hello World",
			signatory: "034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
			signature:
				"304402200fb4adddd1f1d652b544ea6ab62828a0a65b712ed447e2538db0caebfa68929e02205ecb2e1c63b29879c2ecf1255db506d671c8b3fa6017f67cfd1bf07e6edd1cc8",
		};
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(
				<EnvironmentProvider env={env}>
					<SignMessage
						profileId={profile.id()}
						walletId={wallet.id()}
						signatoryAddress="D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib"
						isOpen={true}
					/>
				</EnvironmentProvider>,
			);

			await waitFor(() =>
				expect(rendered.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SIGN_MESSAGE.TITLE),
			);
		});

		const { getByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			const messageInput = getByTestId("SignMessage__message-input");
			expect(messageInput).toBeTruthy();

			await fireEvent.change(messageInput, { target: { value: "Hello World" } });

			const mnemonicInput = getByTestId("SignMessage__mnemonic-input");
			expect(mnemonicInput).toBeTruthy();

			await fireEvent.change(mnemonicInput, { target: { value: identity.mnemonic } });

			await fireEvent.click(getByTestId("SignMessage__submit-button"));

			await waitFor(() =>
				expect(rendered.getByTestId("modal__inner")).toHaveTextContent(
					translations.MODAL_SIGN_MESSAGE.SUCCESS_TITLE,
				),
			);

			const writeTextMock = jest.fn();
			const clipboardOriginal = navigator.clipboard;

			// @ts-ignore
			navigator.clipboard = { writeText: writeTextMock };

			await fireEvent.click(getByTestId(`SignMessage__copy-button`));
			await waitFor(() => expect(writeTextMock).toHaveBeenCalledWith(JSON.stringify(signedMessage)));

			// @ts-ignore
			navigator.clipboard = clipboardOriginal;
		});
	});
});
