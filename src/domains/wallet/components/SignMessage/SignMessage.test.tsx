/* eslint-disable @typescript-eslint/require-await */
import { Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, RenderResult, renderWithRouter, useDefaultNetMocks,waitFor } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

import { translations } from "../../i18n";
import { SignMessage } from "./SignMessage";

let profile: Profile;
let wallet: Wallet;
const mnemonic = "this is a top secret password";

describe("SignMessage", () => {
	beforeAll(useDefaultNetMocks);

	beforeEach(async () => {
		await env.bootFromObject(fixtureData);
		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
	});

	it("should render", () => {
		const { asFragment } = renderWithRouter(
			<SignMessage
				profileId={profile.id()}
				walletId={wallet.id()}
				signatoryAddress="D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD"
				isOpen={true}
			/>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should sign message", async () => {
		const signedMessage = {
			message: "Hello World",
			signatory: "0360e26c8ab14e1bebf4d5f36ab16dcefc9e7b9d9e000ae2470397eccdf1280f6f",
			signature:
				"3044022045c46d10f1c12f0d1e80f4e7be44e6bf6885eb663eccf1d242eca0774bdbdcaf0220490f38e44addd959b077ef98f8cd01cf84fb91a3f8a2a938cfe61f7b477c734c",
		};

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<SignMessage
					profileId={profile.id()}
					walletId={wallet.id()}
					signatoryAddress="D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD"
					isOpen={true}
				/>,
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

			await fireEvent.change(mnemonicInput, { target: { value: mnemonic } });

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
