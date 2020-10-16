import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { translations } from "../../i18n";
import { MultiSignatureDetail } from "./MultiSignatureDetail";

describe("MultiSignatureDetail", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;

	const fixtures: Record<string, any> = {
		transfer: undefined,
		multiSignature: undefined,
		multiPayment: undefined,
	};

	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();

		fixtures.transfer = await wallet
			.coin()
			.transaction()
			.transfer({
				nonce: "1",
				from: "DM7UiH4b2rW2Nv11Wu6ToiZi8MJhGCEWhP",
				fee: "1",
				data: {
					to: wallet.address(),
					amount: "1",
				},
				sign: {
					mnemonic: "test",
				},
			});

		fixtures.multiSignature = await wallet
			.coin()
			.transaction()
			.multiSignature({
				nonce: "1",
				from: "DM7UiH4b2rW2Nv11Wu6ToiZi8MJhGCEWhP",
				fee: "1",
				data: {
					min: 2,
					publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!],
					senderPublicKey: wallet.publicKey()!,
				},
				sign: {
					multiSignature: {
						min: 2,
						publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!],
					},
				},
			});

		fixtures.multiPayment = await wallet
			.coin()
			.transaction()
			.multiPayment({
				nonce: "1",
				from: "DM7UiH4b2rW2Nv11Wu6ToiZi8MJhGCEWhP",
				fee: "1",
				data: {
					payments: [
						{
							amount: "1",
							to: wallet.address(),
						},
						{
							amount: "2",
							to: wallet.address(),
						},
					],
				},
				sign: {
					mnemonic: "test",
				},
			});
	});

	it("should render summary step for transfer", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "isAwaitingSignatureByPublicKey").mockImplementation(() => false);

		const { container } = render(<MultiSignatureDetail transaction={fixtures.transfer} wallet={wallet} isOpen />);

		await waitFor(() => expect(screen.getByText(translations.TRANSACTION_TYPES.TRANSFER)));

		expect(container).toMatchSnapshot();
	});

	it("should render summary step for multi payment", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "isAwaitingSignatureByPublicKey").mockImplementation(() => false);

		const { container } = render(
			<MultiSignatureDetail transaction={fixtures.multiPayment} wallet={wallet} isOpen />,
		);

		await waitFor(() => expect(screen.getByText(translations.TRANSACTION_TYPES.MULTI_PAYMENT)));

		expect(container).toMatchSnapshot();
	});

	it("should render summary step for multi signature", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "isAwaitingSignatureByPublicKey").mockImplementation(() => false);

		const { container } = render(
			<MultiSignatureDetail transaction={fixtures.multiSignature} wallet={wallet} isOpen />,
		);

		await waitFor(() => expect(screen.getByText(translations.TRANSACTION_TYPES.MULTI_SIGNATURE)));

		expect(container).toMatchSnapshot();
	});

	it("should show send button when able to broadcast", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => true);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => false);

		const { container } = render(<MultiSignatureDetail transaction={fixtures.transfer} wallet={wallet} isOpen />);

		await waitFor(() => expect(screen.getByTestId("MultiSignatureDetail__broadcast")));

		expect(container).toMatchSnapshot();
	});

	it("should show paginator when able to sign", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => true);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => true);

		const { container } = render(<MultiSignatureDetail transaction={fixtures.transfer} wallet={wallet} isOpen />);

		await waitFor(() => expect(screen.getByTestId("Paginator__sign")));

		expect(container).toMatchSnapshot();
	});

	it("should emit close when click on cancel button", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => true);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => true);

		const onClose = jest.fn();
		const { container } = render(
			<MultiSignatureDetail transaction={fixtures.transfer} wallet={wallet} isOpen onClose={onClose} />,
		);

		await waitFor(() => expect(screen.getByTestId("Paginator__cancel")));

		act(() => {
			fireEvent.click(screen.getByTestId("Paginator__cancel"));
		});

		expect(onClose).toHaveBeenCalled();
	});

	it("should go to authentication step with sign button", async () => {
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => true);

		render(<MultiSignatureDetail transaction={fixtures.transfer} wallet={wallet} isOpen />);

		await waitFor(() => expect(screen.getByTestId("Paginator__sign")));

		act(() => {
			fireEvent.click(screen.getByTestId("Paginator__sign"));
		});

		await waitFor(() => expect(screen.getByTestId("AuthenticationStep")).toBeInTheDocument());
	});

	it("should sign transaction after authentication page", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => true);
		jest.spyOn(wallet.transaction(), "sync").mockResolvedValue(void 0);

		const addSignatureMock = jest.spyOn(wallet.transaction(), "addSignature").mockResolvedValue(void 0);

		const { container } = render(<MultiSignatureDetail transaction={fixtures.transfer} wallet={wallet} isOpen />);

		await waitFor(() => expect(screen.getByTestId("Paginator__sign")));

		act(() => {
			fireEvent.click(screen.getByTestId("Paginator__sign"));
		});

		await waitFor(() => expect(screen.getByTestId("AuthenticationStep")).toBeInTheDocument());

		act(() => {
			fireEvent.input(screen.getByTestId("AuthenticationStep__mnemonic"), {
				target: {
					value: "my mnemonic",
				},
			});
		});

		await waitFor(() => expect(screen.getByTestId("Paginator__continue")).not.toBeDisabled(), { timeout: 1000 });

		act(() => {
			fireEvent.click(screen.getByTestId("Paginator__continue"));
		});

		await waitFor(() => expect(addSignatureMock).toHaveBeenCalled());
		await waitFor(() => expect(screen.getByText(translations.SUCCESS.TITLE)).toBeInTheDocument());

		expect(container).toMatchSnapshot();
	});
});
