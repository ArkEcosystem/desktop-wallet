import { Contracts } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { act as actHook, renderHook } from "@testing-library/react-hooks";
import { LedgerProvider } from "app/contexts";
import React from "react";
import {
	env,
	getDefaultLedgerTransport,
	getDefaultProfileId,
	waitFor,
	WithProviders,
	defaultNetMocks,
} from "utils/testing-library";

import { useTransactionBuilder } from "./use-transaction-builder";

describe("Use Transaction Builder with Ledger", () => {
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
	});

	it("should sign transfer with ledger", async () => {
		await wallet.synchroniser().identity();
		const { result } = renderHook(() => useTransactionBuilder(profile), { wrapper });

		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockResolvedValue(
			"027716e659220085e41389efc7cf6a05f7f7c659cf3db9126caabce6cda9156582",
		);
		jest.spyOn(wallet, "isLedger").mockImplementation(() => true);
		jest.spyOn(wallet.coin().ledger(), "signTransaction").mockResolvedValue(
			"dd3f96466bc50077b01e441cd35eb3c5aabd83670d371c2be8cc772ed189a7315dd66e88bde275d89a3beb7ef85ef84a52ec4213f540481cd09ecf6d21e452bf",
		);

		const input: Contracts.TransferInput = {
			from: wallet.address(),
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			sign: {},
		};

		let transaction: any;

		await actHook(async () => {
			transaction = (await result.current.build("transfer", input)).transaction;
		});

		await waitFor(() =>
			expect(transaction.id()).toBe("5ef0e7225bed4cb4c3c763ac4d3bd37f8c8d1b93e5edf540b8cc444bce4cdca5"),
		);

		jest.clearAllMocks();
	});

	it("should sign transfer with cold ledger wallet", async () => {
		const { result } = renderHook(() => useTransactionBuilder(profile), { wrapper });

		jest.spyOn(wallet, "publicKey").mockImplementation(() => undefined);
		jest.spyOn(wallet, "isLedger").mockImplementation(() => true);
		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockResolvedValue(
			"0335a27397927bfa1704116814474d39c2b933aabb990e7226389f022886e48deb",
		);
		jest.spyOn(wallet.coin().ledger(), "signTransaction").mockResolvedValue(
			"dd3f96466bc50077b01e441cd35eb3c5aabd83670d371c2be8cc772ed189a7315dd66e88bde275d89a3beb7ef85ef84a52ec4213f540481cd09ecf6d21e452bf",
		);

		const input: Contracts.TransferInput = {
			from: wallet.address(),
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			sign: {},
		};

		let transaction: any;

		await actHook(async () => {
			transaction = (await result.current.build("transfer", input)).transaction;
		});

		expect(transaction.id()).toBe("50f6046de032ea49b5d2894c5f027527564764c7d84633c146babada1707dd9f");

		jest.clearAllMocks();
	});

	it("should abort build with ledger", async () => {
		const abortCtrl = new AbortController();
		const abortSignal = abortCtrl.signal;

		const { result } = renderHook(() => useTransactionBuilder(profile), { wrapper });

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

		const input: Contracts.TransferInput = {
			from: wallet.address(),
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			sign: {},
		};

		setTimeout(() => abortCtrl.abort(), 100);
		let error: string;

		await actHook(async () => {
			try {
				await result.current.build("transfer", input, { abortSignal });
			} catch (e) {
				error = e;
			}
		});

		await waitFor(() => expect(error).toEqual("ERR_ABORT"));

		jest.clearAllMocks();
	});
});
