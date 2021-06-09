import { Contracts } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { act as actHook, renderHook } from "@testing-library/react-hooks";
import { LedgerProvider } from "app/contexts";
import React from "react";
import {
	defaultNetMocks,
	env,
	getDefaultLedgerTransport,
	getDefaultProfileId,
	getDefaultWalletMnemonic,
	waitFor,
	WithProviders,
} from "utils/testing-library";

import { useTransactionBuilder } from "./use-transaction-builder";

describe("Use Transaction Builder Hook", () => {
	let profile: ProfileContracts.IProfile;
	let wallet: ProfileContracts.IReadWriteWallet;
	const transport = getDefaultLedgerTransport();

	const wrapper = ({ children }: any) => (
		<WithProviders>
			<LedgerProvider transport={transport}>{children}</LedgerProvider>
		</WithProviders>
	);

	beforeAll(async () => {
		defaultNetMocks();
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();

		await profile.sync();
	});

	it("should sign transfer", async () => {
		const { result } = renderHook(() => useTransactionBuilder(), { wrapper });

		const signatory = await wallet.signatory().mnemonic(getDefaultWalletMnemonic());
		const input: Contracts.TransferInput = {
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			signatory,
		};

		let transaction: any;

		await actHook(async () => {
			transaction = (await result.current.build("transfer", input, wallet)).transaction;
		});

		expect(transaction.id()).toBe("bad2e9a02690d7cb0efdddfff1f7eacdf4685e22c0b5c3077e1de67511e2553d");
	});

	it("should sign transfer with multisignature wallet", async () => {
		const { result } = renderHook(() => useTransactionBuilder(), { wrapper });

		jest.spyOn(wallet, "isMultiSignature").mockImplementation(() => true);
		jest.spyOn(wallet.multiSignature(), "all").mockReturnValue({
			min: 2,
			publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!],
		});

		const signatory = await wallet.signatory().mnemonic(getDefaultWalletMnemonic());
		const input: Contracts.TransferInput = {
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			signatory,
		};

		let transaction: any;

		await actHook(async () => {
			transaction = (await result.current.build("transfer", input, wallet)).transaction;
		});

		expect(transaction.id()).toBe("11b2dcd2923db56786353c915cd6df6689f2a74d4335c7d584da1936a1192e21");

		jest.clearAllMocks();
	});

	it("should sign transfer with ledger", async () => {
		const { result } = renderHook(() => useTransactionBuilder(), { wrapper });
		jest.spyOn(wallet.coin(), "__construct").mockImplementation();
		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockResolvedValue(
			"027716e659220085e41389efc7cf6a05f7f7c659cf3db9126caabce6cda9156582",
		);
		jest.spyOn(wallet, "isLedger").mockImplementation(() => true);
		jest.spyOn(wallet.coin().ledger(), "signTransaction").mockResolvedValue(
			"dd3f96466bc50077b01e441cd35eb3c5aabd83670d371c2be8cc772ed189a7315dd66e88bde275d89a3beb7ef85ef84a52ec4213f540481cd09ecf6d21e452bf",
		);

		const signatory = await wallet.signatory().mnemonic(getDefaultWalletMnemonic());
		const input: Contracts.TransferInput = {
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			signatory,
		};

		let transaction: any;

		await actHook(async () => {
			transaction = (await result.current.build("transfer", input, wallet)).transaction;
		});

		await waitFor(() =>
			expect(transaction.id()).toBe("11b2dcd2923db56786353c915cd6df6689f2a74d4335c7d584da1936a1192e21"),
		);

		jest.clearAllMocks();
	});

	it("should sign transfer with cold ledger wallet", async () => {
		const { result } = renderHook(() => useTransactionBuilder(), { wrapper });
		jest.spyOn(wallet.coin(), "__construct").mockImplementation();
		jest.spyOn(wallet, "publicKey").mockImplementation(() => undefined);
		jest.spyOn(wallet, "isLedger").mockImplementation(() => true);
		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockResolvedValue(
			"0335a27397927bfa1704116814474d39c2b933aabb990e7226389f022886e48deb",
		);
		jest.spyOn(wallet.coin().ledger(), "signTransaction").mockResolvedValue(
			"dd3f96466bc50077b01e441cd35eb3c5aabd83670d371c2be8cc772ed189a7315dd66e88bde275d89a3beb7ef85ef84a52ec4213f540481cd09ecf6d21e452bf",
		);

		const signatory = await wallet.signatory().mnemonic(getDefaultWalletMnemonic());
		const input: Contracts.TransferInput = {
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			signatory,
		};

		let transaction: any;

		await actHook(async () => {
			transaction = (await result.current.build("transfer", input, wallet)).transaction;
		});

		expect(transaction.id()).toBe("11b2dcd2923db56786353c915cd6df6689f2a74d4335c7d584da1936a1192e21");

		jest.clearAllMocks();
	});

	it("should abort build with ledger", async () => {
		const abortCtrl = new AbortController();
		const abortSignal = abortCtrl.signal;

		const { result } = renderHook(() => useTransactionBuilder(), { wrapper });

		jest.spyOn(wallet, "isLedger").mockImplementation(() => true);
		jest.spyOn(wallet.coin().ledger(), "signTransaction").mockImplementation(
			() =>
				new Promise((resolve) =>
					setTimeout(
						() =>
							resolve(
								"dd3f96466bc50077b01e441cd35eb3c5aabd83670d371c2be8cc772ed189a7315dd66e88bde275d89a3beb7ef85ef84a52ec4213f540481cd09ecf6d21e452bf",
							),
						20000,
					),
				),
		);

		const signatory = await wallet.signatory().mnemonic(getDefaultWalletMnemonic());
		const input: Contracts.TransferInput = {
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			signatory,
		};

		setTimeout(() => abortCtrl.abort(), 100);
		let error: string;

		await actHook(async () => {
			try {
				await result.current.build("transfer", input, wallet, { abortSignal });
			} catch (e) {
				error = e;
			}
		});

		await waitFor(() => expect(error).toEqual("ERR_ABORT"));

		jest.clearAllMocks();
	});
});
