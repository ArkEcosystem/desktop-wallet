import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { PendingTransactions } from "domains/transaction/components/TransactionTable/PendingTransactionsTable";
import nock from "nock";
import React from "react";
import * as utils from "utils/electron-utils";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

describe("Signed Transaction Table", () => {
	let profile: Contracts.IProfile;
	let wallet: Contracts.IReadWriteWallet;

	const fixtures: Record<string, any> = {
		ipfs: undefined,
		multiPayment: undefined,
		multiSignature: undefined,
		transfer: undefined,
		unvote: undefined,
		vote: undefined,
	};

	const mockPendingTransfers = (wallet: Contracts.IReadWriteWallet) => {
		jest.spyOn(wallet.transaction(), "pending").mockReturnValue({
			[fixtures.transfer.id()]: fixtures.transfer,
		});
		jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		jest.spyOn(wallet.transaction(), "hasBeenSigned").mockReturnValue(true);
		jest.spyOn(wallet.transaction(), "isAwaitingConfirmation").mockReturnValue(true);
		jest.spyOn(wallet.transaction(), "transaction").mockImplementation(() => ({ get: () => undefined }));
	};

	const mockMultisignatures = (wallet: Contracts.IReadWriteWallet) => {
		jest.spyOn(wallet.transaction(), "pending").mockReturnValue({
			[fixtures.transfer.id()]: fixtures.transfer,
		});
		jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		jest.spyOn(wallet.transaction(), "hasBeenSigned").mockReturnValue(false);
		jest.spyOn(wallet.transaction(), "isAwaitingConfirmation").mockReturnValue(false);
		jest.spyOn(wallet.transaction(), "transaction").mockImplementation(() => ({ get: () => "data" }));
	};

	beforeAll(() => {
		nock.disableNetConnect();
		nock("https://dwallets.ark.io")
			.get("/api/transactions")
			.query(true)
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/devnet/transactions.json");
				data[0].confirmations = 0;
				return {
					data: data.slice(0, 2),
					meta,
				};
			});

		profile = env.profiles().findById(getDefaultProfileId());

		wallet = profile.wallets().first();
	});

	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());

		wallet = profile.wallets().first();

		await profile.sync();

		fixtures.transfer = new DTO.ExtendedSignedTransactionData(
			await wallet
				.coin()
				.transaction()
				.transfer({
					data: {
						amount: 1,
						to: wallet.address(),
					},
					fee: 0.1,
					nonce: "1",
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
			wallet,
		);

		fixtures.multiSignature = new DTO.ExtendedSignedTransactionData(
			await wallet
				.coin()
				.transaction()
				.multiSignature({
					data: {
						min: 2,
						publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!],
						senderPublicKey: wallet.publicKey()!,
					},
					fee: 0.1,
					nonce: "1",
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
			wallet,
		);

		fixtures.multiPayment = new DTO.ExtendedSignedTransactionData(
			await wallet
				.coin()
				.transaction()
				.multiPayment({
					data: {
						payments: [
							{
								amount: 1,
								to: wallet.address(),
							},
							{
								amount: 1,
								to: wallet.address(),
							},
						],
					},
					fee: 0.1,
					nonce: "1",
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
			wallet,
		);

		fixtures.vote = new DTO.ExtendedSignedTransactionData(
			await wallet
				.coin()
				.transaction()
				.vote({
					data: {
						unvotes: [],
						votes: ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"],
					},
					fee: 0.1,
					nonce: "1",
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
			wallet,
		);

		fixtures.unvote = new DTO.ExtendedSignedTransactionData(
			await wallet
				.coin()
				.transaction()
				.vote({
					data: {
						unvotes: ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"],
						votes: [],
					},
					fee: 0.1,
					nonce: "1",
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
			wallet,
		);

		fixtures.ipfs = new DTO.ExtendedSignedTransactionData(
			await wallet
				.coin()
				.transaction()
				.ipfs({
					data: {
						hash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
					},
					fee: 0.1,
					nonce: "1",
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
			wallet,
		);

		for (const transactionFixture of Object.values(fixtures)) {
			jest.spyOn(transactionFixture, "isMultiPayment").mockReturnValue(false);
			jest.spyOn(transactionFixture, "isTransfer").mockReturnValue(false);
		}
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("should render pending transfers", () => {
		mockPendingTransfers(wallet);

		const { asFragment } = render(<PendingTransactions wallet={wallet} />);

		expect(asFragment()).toMatchSnapshot();

		jest.restoreAllMocks();
	});

	it("should handle click on pending transfer row", async () => {
		const onClick = jest.fn();
		mockPendingTransfers(wallet);

		const { getAllByTestId } = render(<PendingTransactions wallet={wallet} onPendingTransactionClick={onClick} />);

		act(() => {
			fireEvent.click(getAllByTestId("TableRow")[0]);
		});

		await waitFor(() => expect(onClick).toHaveBeenCalled());

		jest.restoreAllMocks();
	});

	it("should render signed transactions", () => {
		const isMultiSignatureReadyMock = jest
			.spyOn(wallet.coin().multiSignature(), "isMultiSignatureReady")
			.mockReturnValue(true);
		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(false);

		const { asFragment } = render(<PendingTransactions wallet={wallet} />);

		expect(asFragment()).toMatchSnapshot();

		canBeSignedMock.mockReset();
		isMultiSignatureReadyMock.mockRestore();
	});

	it("should show as awaiting confirmations", async () => {
		mockPendingTransfers(wallet);

		const { asFragment } = render(<PendingTransactions wallet={wallet} />);
		await waitFor(() => expect(screen.getByText("status-pending.svg")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();

		jest.restoreAllMocks();
	});

	it("should show as awaiting the wallet signature", async () => {
		mockMultisignatures(wallet);
		jest.spyOn(wallet.transaction(), "isAwaitingOurSignature").mockReturnValue(true);

		const { asFragment } = render(<PendingTransactions wallet={wallet} />);
		await waitFor(() => expect(screen.getByText("awaiting-our-signature.svg")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();

		jest.restoreAllMocks();
	});

	it("should show as multiSignature ready", async () => {
		mockMultisignatures(wallet);
		jest.spyOn(wallet.transaction(), "isAwaitingOurSignature").mockReturnValue(false);
		jest.spyOn(wallet.transaction(), "isAwaitingOtherSignatures").mockReturnValue(false);
		jest.spyOn(wallet.coin().multiSignature(), "isMultiSignatureReady").mockReturnValue(true);

		const { asFragment, getByTestId } = render(<PendingTransactions wallet={wallet} />);
		await waitFor(() => expect(getByTestId("TransactionRowInfo__multiSignature")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();

		jest.restoreAllMocks();
	});

	it("should show unconfirmed multiSignature transactions", async () => {
		mockMultisignatures(wallet);
		jest.spyOn(wallet.transaction(), "isAwaitingOurSignature").mockReturnValue(false);
		jest.spyOn(wallet.transaction(), "isAwaitingOtherSignatures").mockReturnValue(false);
		jest.spyOn(wallet.coin().multiSignature(), "isMultiSignatureReady").mockReturnValue(true);
		jest.spyOn(wallet.transaction(), "isAwaitingConfirmation").mockReturnValue(true);

		const { asFragment, getByTestId } = render(<PendingTransactions wallet={wallet} />);
		await waitFor(() => expect(getByTestId("TransactionRowInfo__multiSignature")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();

		jest.restoreAllMocks();
	});

	it("should show as awaiting other wallets signatures", async () => {
		mockMultisignatures(wallet);
		const isAwaitingOurSignatureMock = jest
			.spyOn(wallet.transaction(), "isAwaitingOtherSignatures")
			.mockImplementation(() => true);
		const remainingSignatureCountMock = jest
			.spyOn(wallet.coin().multiSignature(), "remainingSignatureCount")
			.mockImplementation(() => 3);

		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(false);
		const { asFragment } = render(<PendingTransactions wallet={wallet} />);
		await waitFor(() => expect(screen.getByText("awaiting-other-signature.svg")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();

		isAwaitingOurSignatureMock.mockRestore();
		remainingSignatureCountMock.mockRestore();
		canBeSignedMock.mockRestore();
		jest.restoreAllMocks();
	});

	it("should show as final signature", async () => {
		mockMultisignatures(wallet);
		const isAwaitingOurSignatureMock = jest
			.spyOn(wallet.coin().multiSignature(), "isMultiSignatureReady")
			.mockImplementation(() => {
				throw new Error();
			});

		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		const { asFragment } = render(<PendingTransactions wallet={wallet} />);
		await waitFor(() => expect(screen.getByText("awaiting-final-signature.svg")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();

		isAwaitingOurSignatureMock.mockRestore();
		canBeSignedMock.mockRestore();
		jest.restoreAllMocks();
	});

	it("should show the sign button", () => {
		mockMultisignatures(wallet);
		const onClick = jest.fn();
		const awaitingMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);

		const { asFragment } = render(<PendingTransactions wallet={wallet} onClick={onClick} />);

		act(() => {
			fireEvent.click(screen.getByTestId("TransactionRow__sign"));
		});

		expect(onClick).toHaveBeenCalled();
		expect(asFragment()).toMatchSnapshot();

		awaitingMock.mockReset();
		jest.restoreAllMocks();
	});

	it.each(["light", "dark"])("should set %s shadow color on mouse events", async (theme) => {
		mockMultisignatures(wallet);
		jest.spyOn(utils, "shouldUseDarkColors").mockImplementation(() => theme === "dark");

		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		render(<PendingTransactions wallet={wallet} />);
		act(() => {
			fireEvent.mouseEnter(screen.getAllByRole("row")[1]);
		});

		await waitFor(() => expect(screen.getAllByRole("row")[1]).toBeInTheDocument());

		act(() => {
			fireEvent.mouseLeave(screen.getAllByRole("row")[1]);
		});

		await waitFor(() => expect(screen.getAllByRole("row")[1]).toBeInTheDocument());
		canBeSignedMock.mockRestore();
		jest.restoreAllMocks();
	});

	it("should show as vote", () => {
		mockMultisignatures(wallet);
		const isVoteMock = jest.spyOn(fixtures.transfer, "type").mockReturnValue("vote");

		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		const { asFragment } = render(<PendingTransactions wallet={wallet} />);

		expect(asFragment()).toMatchSnapshot();

		isVoteMock.mockRestore();
		canBeSignedMock.mockRestore();
		jest.restoreAllMocks();
	});

	it("should show as unvote", () => {
		mockPendingTransfers(wallet);
		const isUnvoteMock = jest.spyOn(fixtures.transfer, "type").mockReturnValue("unvote");

		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		const { asFragment } = render(<PendingTransactions wallet={wallet} />);

		expect(asFragment()).toMatchSnapshot();

		isUnvoteMock.mockRestore();
		canBeSignedMock.mockRestore();
		jest.restoreAllMocks();
	});
});
