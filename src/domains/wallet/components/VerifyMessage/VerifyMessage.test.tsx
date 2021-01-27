/* eslint-disable @typescript-eslint/require-await */

import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "testing-library";

import { VerifyMessage } from "./VerifyMessage";

let wallet: ReadWriteWallet;
let profile: Profile;
let signedMessage: any;
let signedMessageText: string;
let signedMessageMnemonic: string;

describe("VerifyMessage", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		signedMessageText = "Hello World";
		signedMessageMnemonic = "top secret";

		signedMessage = await wallet.message().sign({
			message: signedMessageText,
			mnemonic: signedMessageMnemonic,
		});
	});

	it("should render", () => {
		const { container, asFragment } = render(
			<VerifyMessage
				isOpen={true}
				signatory={signedMessage.signatory}
				walletId={wallet.id()}
				profileId={profile.id()}
			/>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the non verify address content", () => {
		const { asFragment, getByTestId } = render(
			<VerifyMessage
				isOpen={true}
				signatory={signedMessage.signatory}
				walletId={wallet.id()}
				profileId={profile.id()}
			/>,
		);

		const verifyAddressToggle = getByTestId("verify-address__toggle");
		act(() => {
			fireEvent.click(verifyAddressToggle);
		});
		expect(getByTestId("noverify-address__content")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open verify message modal and cancel", () => {
		const onCancel = jest.fn();
		const { getByTestId } = render(
			<VerifyMessage
				isOpen={true}
				onCancel={onCancel}
				signatory={signedMessage.signatory}
				walletId={wallet.id()}
				profileId={profile.id()}
			/>,
		);

		const cancelButton = getByTestId("VerifyMessage__cancel");
		act(() => {
			fireEvent.click(cancelButton);
		});
		expect(onCancel).toBeCalled();
	});

	it("should open verify message modal and close modal", () => {
		const onClose = jest.fn();
		const { getByTestId } = render(
			<VerifyMessage
				isOpen={true}
				onClose={onClose}
				signatory={signedMessage.signatory}
				walletId={wallet.id()}
				profileId={profile.id()}
			/>,
		);

		const closeButton = getByTestId("modal__close-btn");
		act(() => {
			fireEvent.click(closeButton);
		});
		expect(onClose).toBeCalled();
	});

	it("should not verify if empty inputs", async () => {
		const onSubmit = jest.fn();
		const { getByTestId } = render(
			<VerifyMessage
				isOpen={true}
				onSubmit={onSubmit}
				signatory={signedMessage.signatory}
				walletId={wallet.id()}
				profileId={profile.id()}
			/>,
		);

		const submitButton = getByTestId("VerifyMessage__submit");
		act(() => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(onSubmit).toBeCalledWith(false);
		});
	});

	it("should verify message ", async () => {
		const onSubmit = jest.fn();
		const { getByTestId } = render(
			<VerifyMessage
				isOpen={true}
				onSubmit={onSubmit}
				signatory={signedMessage.signatory}
				walletId={wallet.id()}
				profileId={profile.id()}
			/>,
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
			expect(onSubmit).toBeCalledWith(true);
		});
	});

	it("should verify message using json", async () => {
		const onSubmit = jest.fn();
		const { getByTestId } = render(
			<VerifyMessage
				isOpen={true}
				onSubmit={onSubmit}
				signatory={signedMessage.signatory}
				walletId={wallet.id()}
				profileId={profile.id()}
			/>,
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
			expect(onSubmit).toBeCalledWith(true);
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		await act(async () => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});
	});

	it("should not verify message using invalid json", async () => {
		const onSubmit = jest.fn();
		const { getByTestId } = render(
			<VerifyMessage
				isOpen={true}
				onSubmit={onSubmit}
				signatory={signedMessage.signatory}
				walletId={wallet.id()}
				profileId={profile.id()}
			/>,
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
			expect(onSubmit).toBeCalledWith(false);
		});
	});
});
