import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { PendingTransactions } from "domains/transaction/components/TransactionTable/PendingTransactionsTable";
import nock from "nock";
import React from "react";
import * as utils from "utils/electron-utils";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";
let transfers: DTO.ExtendedTransactionData[];

describe("Signed Transaction Table", () => {
	let profile: Contracts.IProfile;
	let wallet: Contracts.IReadWriteWallet;

	const fixtures: Record<string, any> = {
		transfer: undefined,
		multiSignature: undefined,
		multiPayment: undefined,
		vote: undefined,
		unvote: undefined,
		ipfs: undefined,
	};

	beforeAll(async () => {
		nock.disableNetConnect();
		nock("https://dwallets.ark.io")
			.get("/api/transactions")
			.query(true)
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/devnet/transactions.json");
				data[0].confirmations = 0;
				return {
					meta,
					data: data.slice(0, 2),
				};
			});

		profile = env.profiles().findById(getDefaultProfileId());

		wallet = profile.wallets().first();
		const sent = await wallet.transactionIndex().sent({ limit: 20, cursor: 1 });
		transfers = sent
			.items()
			.filter(
				(transaction) =>
					!transaction.isConfirmed() && (transaction.isMultiPayment() || transaction.isTransfer()),
			);
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
					nonce: "1",
					fee: 0.1,
					data: {
						to: wallet.address(),
						amount: 1,
					},
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
		);

		fixtures.multiSignature = new DTO.ExtendedSignedTransactionData(
			await wallet
				.coin()
				.transaction()
				.multiSignature({
					nonce: "1",
					fee: 0.1,
					data: {
						min: 2,
						publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!],
						senderPublicKey: wallet.publicKey()!,
					},
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
		);

		fixtures.multiPayment = new DTO.ExtendedSignedTransactionData(
			await wallet
				.coin()
				.transaction()
				.multiPayment({
					nonce: "1",
					fee: 0.1,
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
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
		);

		fixtures.vote = new DTO.ExtendedSignedTransactionData(
			await wallet
				.coin()
				.transaction()
				.vote({
					nonce: "1",
					fee: 0.1,
					data: {
						votes: ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"],
						unvotes: [],
					},
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
		);

		fixtures.unvote = new DTO.ExtendedSignedTransactionData(
			await wallet
				.coin()
				.transaction()
				.vote({
					nonce: "1",
					fee: 0.1,
					data: {
						votes: [],
						unvotes: ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"],
					},
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
		);

		fixtures.ipfs = new DTO.ExtendedSignedTransactionData(
			await wallet
				.coin()
				.transaction()
				.ipfs({
					nonce: "1",
					fee: 0.1,
					data: {
						hash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
					},
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
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
		const { asFragment } = render(<PendingTransactions transfers={transfers} wallet={wallet} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle click on pending transfer row", async () => {
		const onClick = jest.fn();
		const awaitingMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);

		const { getAllByTestId } = render(
			<PendingTransactions transfers={transfers} wallet={wallet} onPendingTransactionClick={onClick} />,
		);

		act(() => {
			fireEvent.click(getAllByTestId("TableRow")[0]);
		});

		await waitFor(() => expect(onClick).toHaveBeenCalled());

		awaitingMock.mockReset();
	});

	it("should render signed transactions", () => {
		const isMultiSignatureReadyMock = jest
			.spyOn(wallet.coin().multiSignature(), "isMultiSignatureReady")
			.mockReturnValue(true);
		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(false);

		const { asFragment } = render(<PendingTransactions signed={Object.values(fixtures)} wallet={wallet} />);
		expect(asFragment()).toMatchSnapshot();

		canBeSignedMock.mockReset();
		isMultiSignatureReadyMock.mockRestore();
	});

	it("should show as awaiting confirmations", async () => {
		const isAwaitingConfirmationMock = jest
			.spyOn(wallet.transaction(), "isAwaitingConfirmation")
			.mockImplementation(() => true);

		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		const { asFragment } = render(<PendingTransactions signed={[fixtures.transfer]} wallet={wallet} />);
		await waitFor(() => expect(screen.getByText("status-pending.svg")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
		isAwaitingConfirmationMock.mockRestore();
		canBeSignedMock.mockRestore();
	});

	it("should show as awaiting the wallet signature", async () => {
		const isAwaitingOurSignatureMock = jest
			.spyOn(wallet.transaction(), "isAwaitingOurSignature")
			.mockImplementation(() => true);

		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		const { asFragment } = render(<PendingTransactions signed={[fixtures.transfer]} wallet={wallet} />);
		await waitFor(() => expect(screen.getByText("awaiting-our-signature.svg")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
		isAwaitingOurSignatureMock.mockRestore();
		canBeSignedMock.mockRestore();
	});

	it("should show as awaiting other wallets signatures", async () => {
		const isAwaitingOurSignatureMock = jest
			.spyOn(wallet.transaction(), "isAwaitingOtherSignatures")
			.mockImplementation(() => true);
		const remainingSignatureCountMock = jest
			.spyOn(wallet.coin().multiSignature(), "remainingSignatureCount")
			.mockImplementation(() => 3);

		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		const { asFragment } = render(<PendingTransactions signed={[fixtures.transfer]} wallet={wallet} />);
		await waitFor(() => expect(screen.getByText("awaiting-other-signature.svg")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
		isAwaitingOurSignatureMock.mockRestore();
		remainingSignatureCountMock.mockRestore();
		canBeSignedMock.mockRestore();
	});

	it("should show as final signature", async () => {
		const isAwaitingOurSignatureMock = jest
			.spyOn(wallet.coin().multiSignature(), "isMultiSignatureReady")
			.mockImplementation(() => {
				throw new Error();
			});

		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		const { asFragment } = render(<PendingTransactions signed={[fixtures.transfer]} wallet={wallet} />);
		await waitFor(() => expect(screen.getByText("awaiting-final-signature.svg")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
		isAwaitingOurSignatureMock.mockRestore();
		canBeSignedMock.mockRestore();
	});

	it("should show the sign button", () => {
		const onClick = jest.fn();
		const awaitingMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);

		const { asFragment } = render(
			<PendingTransactions signed={[fixtures.multiSignature]} wallet={wallet} onClick={onClick} />,
		);

		act(() => {
			fireEvent.click(screen.getByTestId("TransactionRow__sign"));
		});

		expect(onClick).toHaveBeenCalled();
		expect(asFragment()).toMatchSnapshot();

		awaitingMock.mockReset();
	});

	it.each(["light", "dark"])("should set %s shadow color on mouse events", async (theme) => {
		jest.spyOn(utils, "shouldUseDarkColors").mockImplementation(() => theme === "dark");

		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		render(<PendingTransactions signed={[fixtures.multiSignature]} wallet={wallet} />);
		act(() => {
			fireEvent.mouseEnter(screen.getAllByRole("row")[1]);
		});

		await waitFor(() => expect(screen.getAllByRole("row")[1]).toBeInTheDocument());

		act(() => {
			fireEvent.mouseLeave(screen.getAllByRole("row")[1]);
		});

		await waitFor(() => expect(screen.getAllByRole("row")[1]).toBeInTheDocument());
		canBeSignedMock.mockRestore();
	});

	it("should show as vote", () => {
		const isVoteMock = jest.spyOn(fixtures.transfer, "type").mockReturnValue("vote");

		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		const { asFragment } = render(<PendingTransactions signed={[fixtures.transfer]} wallet={wallet} />);

		expect(asFragment()).toMatchSnapshot();
		isVoteMock.mockRestore();
		canBeSignedMock.mockRestore();
	});

	it("should show as unvote", () => {
		const isUnvoteMock = jest.spyOn(fixtures.transfer, "type").mockReturnValue("unvote");

		const canBeSignedMock = jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		const { asFragment } = render(<PendingTransactions signed={[fixtures.transfer]} wallet={wallet} />);

		expect(asFragment()).toMatchSnapshot();
		isUnvoteMock.mockRestore();
		canBeSignedMock.mockRestore();
	});
});
