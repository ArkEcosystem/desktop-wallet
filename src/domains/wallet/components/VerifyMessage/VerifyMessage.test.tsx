/* eslint-disable @typescript-eslint/require-await */

import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "testing-library";

import { VerifyMessage } from "./VerifyMessage";

let wallet: Contracts.IReadWriteWallet;
let profile: Contracts.IProfile;
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

	const renderComponent = async ({
		isOpen = true,
		walletId = wallet.id(),
		profileId = profile.id(),
		...props
	}: any) => {
		const result = render(<VerifyMessage isOpen={isOpen} walletId={walletId} profileId={profileId} {...props} />);

		const submitButton = screen.getByTestId("VerifyMessage__submit");

		await waitFor(() => {
			expect(submitButton).toBeDisabled();
		});

		return result;
	};

	it("should render", async () => {
		const { asFragment } = await renderComponent({});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should switch between manual and json input", async () => {
		await renderComponent({});

		const toggle = screen.getByTestId("VerifyMessage__toggle");

		expect(screen.getByTestId("VerifyMessage__manual")).toBeTruthy();

		act(() => {
			fireEvent.click(toggle);
		});

		expect(screen.getByTestId("VerifyMessage__json")).toBeTruthy();

		act(() => {
			fireEvent.click(toggle);
		});

		expect(screen.getByTestId("VerifyMessage__manual")).toBeTruthy();
	});

	it("should open verify message modal and cancel", async () => {
		const onCancel = jest.fn();

		await renderComponent({ onCancel });

		const cancelButton = screen.getByTestId("VerifyMessage__cancel");

		act(() => {
			fireEvent.click(cancelButton);
		});

		expect(onCancel).toHaveBeenCalled();
	});

	it("should open verify message modal and close modal", async () => {
		const onClose = jest.fn();

		await renderComponent({ onClose });

		const closeButton = screen.getByTestId("modal__close-btn");

		act(() => {
			fireEvent.click(closeButton);
		});

		expect(onClose).toHaveBeenCalled();
	});

	it("should verify message", async () => {
		const onSubmit = jest.fn();

		await renderComponent({ onSubmit });

		const signatoryInput = screen.getByTestId("VerifyMessage__manual-signatory");
		const messageInput = screen.getByTestId("VerifyMessage__manual-message");
		const signatureInput = screen.getByTestId("VerifyMessage__manual-signature");

		act(() => {
			fireEvent.input(signatoryInput, { target: { value: signedMessage.signatory } });
		});

		act(() => {
			fireEvent.input(messageInput, { target: { value: signedMessage.message } });
		});

		act(() => {
			fireEvent.input(signatureInput, { target: { value: signedMessage.signature } });
		});

		const submitButton = screen.getByTestId("VerifyMessage__submit");

		await waitFor(() => {
			expect(submitButton).not.toBeDisabled();
		});

		act(() => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(true);
		});

		await waitFor(() => {
			expect(screen.getByTestId("modal__inner")).toHaveTextContent("success-banner.svg");
		});
	});

	it("should verify message using json", async () => {
		const onSubmit = jest.fn();

		await renderComponent({ onSubmit });

		const toggle = screen.getByTestId("VerifyMessage__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		const jsonStringInput = screen.getByTestId("VerifyMessage__json-jsonString");

		act(() => {
			fireEvent.input(jsonStringInput, { target: { value: JSON.stringify(signedMessage) } });
		});

		expect(jsonStringInput).toHaveValue(JSON.stringify(signedMessage));

		const submitButton = screen.getByTestId("VerifyMessage__submit");

		await waitFor(() => {
			expect(submitButton).not.toBeDisabled();
		});

		act(() => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(true);
		});

		await waitFor(() => {
			expect(screen.getByTestId("modal__inner")).toHaveTextContent("success-banner.svg");
		});
	});

	it("should fail to verify with invalid signature", async () => {
		const onSubmit = jest.fn();

		await renderComponent({ onSubmit });

		const signatoryInput = screen.getByTestId("VerifyMessage__manual-signatory");
		const messageInput = screen.getByTestId("VerifyMessage__manual-message");
		const signatureInput = screen.getByTestId("VerifyMessage__manual-signature");

		act(() => {
			fireEvent.input(signatoryInput, { target: { value: signedMessage.signatory } });
		});

		act(() => {
			fireEvent.input(messageInput, { target: { value: signedMessage.message } });
		});

		act(() => {
			fireEvent.input(signatureInput, { target: { value: "fake-signature" } });
		});

		const submitButton = screen.getByTestId("VerifyMessage__submit");

		await waitFor(() => {
			expect(submitButton).not.toBeDisabled();
		});

		act(() => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(false);
		});

		await waitFor(() => {
			expect(screen.getByTestId("modal__inner")).toHaveTextContent("error-banner.svg");
		});

		await act(async () => {
			fireEvent.click(screen.getByTestId("modal__close-btn"));
		});
	});

	it("should fail to verify using invalid data", async () => {
		const onSubmit = jest.fn();

		await renderComponent({ onSubmit });

		const signatoryInput = screen.getByTestId("VerifyMessage__manual-signatory");
		const messageInput = screen.getByTestId("VerifyMessage__manual-message");
		const signatureInput = screen.getByTestId("VerifyMessage__manual-signature");

		const messageSpy = jest.spyOn(wallet.message(), "verify").mockRejectedValue(new Error());

		act(() => {
			fireEvent.input(signatoryInput, { target: { value: signedMessage.signatory } });
		});

		act(() => {
			fireEvent.input(messageInput, { target: { value: signedMessage.message } });
		});

		act(() => {
			fireEvent.input(signatureInput, { target: { value: "fake-signature" } });
		});

		const submitButton = screen.getByTestId("VerifyMessage__submit");

		await waitFor(() => {
			expect(submitButton).not.toBeDisabled();
		});

		act(() => {
			fireEvent.click(submitButton);
		});

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(false);
		});

		await waitFor(() => {
			expect(screen.getByTestId("modal__inner")).toHaveTextContent("error-banner.svg");
		});

		await act(async () => {
			fireEvent.click(screen.getByTestId("modal__close-btn"));
		});

		messageSpy.mockRestore();
	});
});
