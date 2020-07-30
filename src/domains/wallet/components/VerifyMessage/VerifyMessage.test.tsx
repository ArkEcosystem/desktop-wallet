/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { act, fireEvent, render, useDefaultNetMocks,waitFor } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { VerifyMessage } from "./VerifyMessage";

let env: Environment;
let wallet: Wallet;
let profile: Profile;
let signedMessage: any;
let signedMessageText: string;
let signedMessageMnemonic: string;

describe("VerifyMessage", () => {
	beforeAll(useDefaultNetMocks);

	beforeEach(async () => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

		await env.bootFromObject(fixtureData);
		await env.persist();

		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		signedMessageText = "Hello world";
		signedMessageMnemonic = "top secret";

		signedMessage = await wallet.message().sign({
			message: signedMessageText,
			mnemonic: signedMessageMnemonic,
		});
	});

	it("should render", () => {
		const { container, asFragment } = render(
			<EnvironmentProvider env={env}>
				<VerifyMessage
					isOpen={true}
					signatory={signedMessage.signatory}
					walletId={wallet.id()}
					profileId={profile.id()}
				/>
			</EnvironmentProvider>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the non verify address content", () => {
		const { asFragment, getByTestId } = render(
			<EnvironmentProvider env={env}>
				<VerifyMessage
					isOpen={true}
					signatory={signedMessage.signatory}
					walletId={wallet.id()}
					profileId={profile.id()}
				/>
			</EnvironmentProvider>,
		);

		const verifyAddressToggle = getByTestId("verify-address__toggle");
		act(() => {
			fireEvent.click(verifyAddressToggle);
		});
		expect(getByTestId("noverify-address__content")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open verify message modal and cancel", () => {
		const fn = jest.fn();
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<VerifyMessage
					isOpen={true}
					onCancel={fn}
					signatory={signedMessage.signatory}
					walletId={wallet.id()}
					profileId={profile.id()}
				/>
			</EnvironmentProvider>,
		);

		const cancelButton = getByTestId("VerifyMessage__cancel");
		act(() => {
			fireEvent.click(cancelButton);
		});
		expect(fn).toBeCalled();
	});

	it("should open verify message modal and close modal", () => {
		const fn = jest.fn();
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<VerifyMessage
					isOpen={true}
					onClose={fn}
					signatory={signedMessage.signatory}
					walletId={wallet.id()}
					profileId={profile.id()}
				/>
			</EnvironmentProvider>,
		);

		const closeButton = getByTestId("modal__close-btn");
		act(() => {
			fireEvent.click(closeButton);
		});
		expect(fn).toBeCalled();
	});

	it("should not verify if empty inputs", async () => {
		const fn = jest.fn();
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<VerifyMessage
					isOpen={true}
					onSubmit={fn}
					signatory={signedMessage.signatory}
					walletId={wallet.id()}
					profileId={profile.id()}
				/>
			</EnvironmentProvider>,
		);

		const submitButton = getByTestId("VerifyMessage__submit");
		act(() => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(fn).toBeCalledWith(false);
		});
	});

	it("should verify message ", async () => {
		const fn = jest.fn();
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<VerifyMessage
					isOpen={true}
					onSubmit={fn}
					signatory={signedMessage.signatory}
					walletId={wallet.id()}
					profileId={profile.id()}
				/>
			</EnvironmentProvider>,
		);

		const verifyAddressToggle = getByTestId("verify-address__toggle");

		act(() => {
			fireEvent.click(verifyAddressToggle);
		});

		const verifyMessageInput = getByTestId("VerifyMessage__message-input");
		const verifySignatureInput = getByTestId("VerifyMessage__signature-input");

		act(() => {
			fireEvent.change(verifyMessageInput, { target: { value: signedMessage.message } });
		});
		act(() => {
			fireEvent.change(verifySignatureInput, { target: { value: signedMessage.signature } });
		});

		const submitButton = getByTestId("VerifyMessage__submit");

		act(() => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(fn).toBeCalledWith(true);
		});
	});

	it("should verify message using json", async () => {
		const fn = jest.fn();
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<VerifyMessage
					isOpen={true}
					onSubmit={fn}
					signatory={signedMessage.signatory}
					walletId={wallet.id()}
					profileId={profile.id()}
				/>
			</EnvironmentProvider>,
		);

		const submitButton = getByTestId("VerifyMessage__submit");
		const messageContent = getByTestId("VerifyMessage_message-content");

		act(() => {
			fireEvent.change(messageContent, { target: { value: JSON.stringify(signedMessage) } });
		});

		expect(messageContent).toHaveValue(JSON.stringify(signedMessage));

		act(() => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(fn).toBeCalledWith(true);
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		await act(async () => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
	});

	it("should not verify message using invalid json", async () => {
		const fn = jest.fn();
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<VerifyMessage
					isOpen={true}
					onSubmit={fn}
					signatory={signedMessage.signatory}
					walletId={wallet.id()}
					profileId={profile.id()}
				/>
			</EnvironmentProvider>,
		);

		const submitButton = getByTestId("VerifyMessage__submit");
		const messageContent = getByTestId("VerifyMessage_message-content");

		act(() => {
			fireEvent.change(messageContent, { target: { value: "test" } });
		});

		act(() => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(fn).toBeCalledWith(false);
		});
	});
});
