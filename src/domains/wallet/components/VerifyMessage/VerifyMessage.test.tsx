/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import nock from "nock";
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";
import { StubStorage } from "tests/mocks";

import { VerifyMessage } from "./VerifyMessage";

let env: Environment;
let wallet: Wallet;
let profile: Profile;
let signedMessage: any;
let signedMessageText: string;
let signedMessageMnemonic: string;

describe("VerifyMessage", () => {
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

		profile = env.profiles().create("John Doe");
		wallet = await profile.wallets().importByMnemonic("this is a top secret passphrase", "ARK", "devnet");

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
					walletPublicKey={wallet.publicKey() as string}
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
					walletPublicKey={wallet.publicKey() as string}
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

	it("should trigger cancel event", () => {
		const fn = jest.fn();
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<VerifyMessage
					isOpen={true}
					onCancel={fn}
					signatory={signedMessage.signatory}
					walletPublicKey={wallet.publicKey() as string}
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

	it("should not verify if empty inputs", async () => {
		const fn = jest.fn();
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<VerifyMessage
					isOpen={true}
					onSubmit={fn}
					signatory={signedMessage.signatory}
					walletPublicKey={wallet.publicKey() as string}
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
					walletPublicKey={wallet.publicKey() as string}
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
					walletPublicKey={wallet.publicKey() as string}
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
					walletPublicKey={wallet.publicKey() as string}
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
