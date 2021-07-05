import { renderHook } from "@testing-library/react-hooks";
import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { PendingTransactions } from "domains/transaction/components/TransactionTable/PendingTransactionsTable";
import nock from "nock";
import React from "react";
import { env, getDefaultProfileId, render } from "utils/testing-library";
import { usePendingTransactions } from "../hooks/use-pending-transactions";

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
		jest.spyOn(wallet.transaction(), "transaction").mockImplementation(() => {
			return { get: () => undefined };
		});
	};

	const mockMultisignatures = (wallet: Contracts.IReadWriteWallet) => {
		jest.spyOn(wallet.transaction(), "pending").mockReturnValue({
			[fixtures.transfer.id()]: fixtures.transfer,
		});
		jest.spyOn(wallet.transaction(), "canBeSigned").mockReturnValue(true);
		jest.spyOn(wallet.transaction(), "hasBeenSigned").mockReturnValue(false);
		jest.spyOn(wallet.transaction(), "isAwaitingConfirmation").mockReturnValue(false);
		jest.spyOn(wallet.transaction(), "transaction").mockImplementation(() => {
			return { get: () => "data" };
		});
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
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("should render unconfirmed pending transfers", () => {
		mockPendingTransfers(wallet);
		jest.spyOn(wallet.transaction(), "isAwaitingConfirmation").mockReturnValue(false);

		const { result } = renderHook(() => usePendingTransactions({ wallet }));
		expect(result.current.transactions).toHaveLength(1);
		expect(result.current.transactions[0]).toEqual({
			hasBeenSigned: true,
			isAwaitingConfirmation: false,
			isAwaitingOtherSignatures: false,
			isAwaitingOurSignature: false,
			isPendingTransfer: true,
			transaction: expect.anything(),
		});

		jest.restoreAllMocks();
	});

	it("should render pending transfers", () => {
		mockPendingTransfers(wallet);
		jest.spyOn(wallet.transaction(), "hasBeenSigned").mockReturnValue(false);

		const { result } = renderHook(() => usePendingTransactions({ wallet }));
		expect(result.current.transactions).toHaveLength(1);
		expect(result.current.transactions[0]).toEqual({
			hasBeenSigned: false,
			isAwaitingConfirmation: true,
			isAwaitingOtherSignatures: false,
			isAwaitingOurSignature: false,
			isPendingTransfer: true,
			transaction: expect.anything(),
		});

		jest.restoreAllMocks();
	});

	it("should render multiSignatures", () => {
		mockMultisignatures(wallet);

		const { result } = renderHook(() => usePendingTransactions({ wallet }));
		expect(result.current.transactions).toHaveLength(1);
		expect(result.current.transactions[0]).toEqual({
			hasBeenSigned: false,
			isAwaitingConfirmation: false,
			isAwaitingOtherSignatures: false,
			isAwaitingOurSignature: false,
			isPendingTransfer: false,
			transaction: expect.anything(),
		});

		jest.restoreAllMocks();
	});
});
