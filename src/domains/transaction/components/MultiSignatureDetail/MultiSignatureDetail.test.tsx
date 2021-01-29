import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { toasts } from "app/services";
import React from "react";
import {
	act,
	env,
	fireEvent,
	getDefaultProfileId,
	getDefaultWalletMnemonic,
	render,
	screen,
	syncDelegates,
	waitFor,
} from "utils/testing-library";

import { translations } from "../../i18n";
import { MultiSignatureDetail } from "./MultiSignatureDetail";

const passphrase = getDefaultWalletMnemonic();

describe("MultiSignatureDetail", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;

	const fixtures: Record<string, any> = {
		transfer: undefined,
		multiSignature: undefined,
		multiPayment: undefined,
		vote: undefined,
		unvote: undefined,
		ipfs: undefined,
	};

	beforeAll(async () => {
		await syncDelegates();
	});

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
					multiSignature: {
						min: 2,
						publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!],
					},
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
					multiSignature: {
						min: 2,
						publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!],
					},
				},
			});

		fixtures.vote = await wallet
			.coin()
			.transaction()
			.vote({
				nonce: "1",
				from: "DM7UiH4b2rW2Nv11Wu6ToiZi8MJhGCEWhP",
				fee: "1",
				data: {
					votes: ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"],
					unvotes: [],
				},
				sign: {
					multiSignature: {
						min: 2,
						publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!],
					},
				},
			});

		fixtures.unvote = await wallet
			.coin()
			.transaction()
			.vote({
				nonce: "1",
				from: "DM7UiH4b2rW2Nv11Wu6ToiZi8MJhGCEWhP",
				fee: "1",
				data: {
					votes: [],
					unvotes: ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"],
				},
				sign: {
					multiSignature: {
						min: 2,
						publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!],
					},
				},
			});

		fixtures.ipfs = await wallet
			.coin()
			.transaction()
			.ipfs({
				nonce: "1",
				from: "DM7UiH4b2rW2Nv11Wu6ToiZi8MJhGCEWhP",
				fee: "1",
				data: {
					hash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
				},
				sign: {
					multiSignature: {
						min: 2,
						publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!],
					},
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

	it("should render summary step for vote", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "isAwaitingSignatureByPublicKey").mockImplementation(() => false);

		const { container } = render(<MultiSignatureDetail transaction={fixtures.vote} wallet={wallet} isOpen />);

		await waitFor(() =>
			expect(screen.getByTestId("header__title")).toHaveTextContent(translations.TRANSACTION_TYPES.VOTE),
		);

		expect(container).toMatchSnapshot();
	});

	it("should render summary step for unvote", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "isAwaitingSignatureByPublicKey").mockImplementation(() => false);

		const { container } = render(<MultiSignatureDetail transaction={fixtures.unvote} wallet={wallet} isOpen />);

		await waitFor(() =>
			expect(screen.getByTestId("header__title")).toHaveTextContent(translations.TRANSACTION_TYPES.UNVOTE),
		);

		expect(container).toMatchSnapshot();
	});

	it("should render summary step for ipfs", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "isAwaitingSignatureByPublicKey").mockImplementation(() => false);

		const { container } = render(<MultiSignatureDetail transaction={fixtures.ipfs} wallet={wallet} isOpen />);

		await waitFor(() =>
			expect(screen.getByTestId("header__title")).toHaveTextContent(translations.TRANSACTION_TYPES.IPFS),
		);

		expect(container).toMatchSnapshot();
	});

	it("should show send button when able to broadcast", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => true);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => false);
		// @ts-ignore
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue(void 0);

		const { container } = render(<MultiSignatureDetail transaction={fixtures.transfer} wallet={wallet} isOpen />);

		await waitFor(() => expect(screen.getByTestId("MultiSignatureDetail__broadcast")));

		expect(container).toMatchSnapshot();

		act(() => {
			fireEvent.click(screen.getByTestId("MultiSignatureDetail__broadcast"));
		});

		await waitFor(() => expect(broadcastMock).toHaveBeenCalled());
		await waitFor(() => expect(screen.getByText(translations.SUCCESS.TITLE)).toBeInTheDocument());

		broadcastMock.mockRestore();
	});

	it("should not show send button when waiting for confirmations", async () => {
		jest.spyOn(wallet.transaction(), "isAwaitingConfirmation").mockImplementationOnce(() => true);
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => true);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => false);

		const { container } = render(<MultiSignatureDetail transaction={fixtures.transfer} wallet={wallet} isOpen />);

		await waitFor(() => expect(screen.queryByTestId("MultiSignatureDetail__broadcast")).not.toBeInTheDocument());

		expect(container).toMatchSnapshot();
	});

	it("should fail to broadcast transaction", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => true);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => false);

		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockRejectedValue(new Error("Failed"));
		const toastsMock = jest.spyOn(toasts, "error");

		const { container } = render(<MultiSignatureDetail transaction={fixtures.transfer} wallet={wallet} isOpen />);

		await waitFor(() => expect(screen.getByTestId("MultiSignatureDetail__broadcast")));

		expect(container).toMatchSnapshot();

		act(() => {
			fireEvent.click(screen.getByTestId("MultiSignatureDetail__broadcast"));
		});

		await waitFor(() => expect(toastsMock).toHaveBeenCalled());

		broadcastMock.mockRestore();
		toastsMock.mockReset();
	});

	it("should show paginator when able to sign", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => true);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => true);

		const { container } = render(<MultiSignatureDetail transaction={fixtures.transfer} wallet={wallet} isOpen />);

		await waitFor(() => expect(screen.getByTestId("Paginator__sign")));

		act(() => {
			fireEvent.click(screen.getByTestId("Paginator__sign"));
		});

		await waitFor(() => expect(screen.getByTestId("AuthenticationStep")));

		act(() => {
			fireEvent.click(screen.getByTestId("Paginator__back"));
		});

		await waitFor(() => expect(screen.getByTestId("Paginator__sign")));

		expect(container).toMatchSnapshot();
	});

	it("should emit close when click on cancel button", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => true);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => true);

		const onClose = jest.fn();
		render(<MultiSignatureDetail transaction={fixtures.transfer} wallet={wallet} isOpen onClose={onClose} />);

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

		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast");
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
					value: passphrase,
				},
			});
		});

		await waitFor(() => expect(screen.getByTestId("Paginator__continue")).not.toBeDisabled(), { timeout: 1000 });

		act(() => {
			fireEvent.click(screen.getByTestId("Paginator__continue"));
		});

		await waitFor(() => expect(addSignatureMock).toHaveBeenCalled());
		await waitFor(() => expect(broadcastMock).not.toHaveBeenCalled());
		await waitFor(() => expect(screen.getByText(translations.SUCCESS.TITLE)).toBeInTheDocument());

		expect(container).toMatchSnapshot();
	});

	it("should fail to sign transaction after authentication page", async () => {
		jest.spyOn(wallet.transaction(), "canBeBroadcasted").mockImplementation(() => false);
		jest.spyOn(wallet.transaction(), "canBeSigned").mockImplementation(() => true);
		jest.spyOn(wallet.transaction(), "sync").mockResolvedValue(void 0);

		const addSignatureMock = jest
			.spyOn(wallet.transaction(), "addSignature")
			.mockRejectedValue(new Error("Failed"));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast");
		const toastsMock = jest.spyOn(toasts, "error");

		render(<MultiSignatureDetail transaction={fixtures.transfer} wallet={wallet} isOpen />);

		await waitFor(() => expect(screen.getByTestId("Paginator__sign")));

		act(() => {
			fireEvent.click(screen.getByTestId("Paginator__sign"));
		});

		await waitFor(() => expect(screen.getByTestId("AuthenticationStep")).toBeInTheDocument());

		act(() => {
			fireEvent.input(screen.getByTestId("AuthenticationStep__mnemonic"), {
				target: {
					value: passphrase,
				},
			});
		});

		await waitFor(() => expect(screen.getByTestId("Paginator__continue")).not.toBeDisabled(), { timeout: 1000 });

		act(() => {
			fireEvent.click(screen.getByTestId("Paginator__continue"));
		});

		await waitFor(() => expect(addSignatureMock).toHaveBeenCalled());
		await waitFor(() => expect(toastsMock).toHaveBeenCalled());
		await waitFor(() => expect(broadcastMock).not.toHaveBeenCalled());
	});
});
