import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React, { useEffect, useState } from "react";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { useWalletTransactions } from "./use-wallet-transactions";

describe("Wallet Transactions Hook", () => {
	let wallet: Contracts.IReadWriteWallet;
	let profile: Contracts.IProfile;

	beforeAll(() => {
		nock("https://dwallets.ark.io")
			.get("/api/transactions")
			.query((parameters) => parameters.page === undefined || parameters.page === "1")
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/devnet/transactions.json");
				return {
					data: data.slice(0, 1),
					meta,
				};
			})
			.get("/api/transactions")
			.query({ address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD", limit: "10", page: "2" })
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/devnet/transactions.json");
				return {
					data: data.slice(1, 3),
					meta,
				};
			})
			.persist();
	});

	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();

		await env.profiles().restore(profile);
		await profile.sync();
	});

	it("should sync pending transactions", async () => {
		const signatory = await wallet
			.signatory()
			.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]);

		const transfer = await wallet
			.coin()
			.transaction()
			.transfer({
				data: {
					amount: 1,
					to: wallet.address(),
				},
				fee: 1,
				nonce: "1",
				signatory,
			});

		jest.spyOn(wallet.transaction(), "sync").mockResolvedValue(void 0);
		jest.spyOn(wallet.transaction(), "broadcasted").mockReturnValue({ 1: transfer });

		let pendingSignedTransactions: DTO.ExtendedSignedTransactionData[];
		let pendingTransferTransactions: DTO.ExtendedSignedTransactionData[];

		const Component = () => {
			const { syncPending, pendingTransfers, pendingSigned } = useWalletTransactions(wallet);
			const [loading, setLoading] = useState(false);

			const run = async () => {
				setLoading(true);
				await syncPending();
				setLoading(false);
				pendingTransferTransactions = pendingTransfers;
				pendingSignedTransactions = pendingSigned;
			};
			return loading ? <span>Loading</span> : <button onClick={run}>Sync</button>;
		};

		render(<Component />);

		act(() => {
			fireEvent.click(screen.getByRole("button"));
		});

		await waitFor(() => expect(screen.queryByText("Loading")).not.toBeInTheDocument());
		await waitFor(() => expect(pendingSignedTransactions).toHaveLength(0));
		await waitFor(() => expect(pendingTransferTransactions).toHaveLength(0));

		jest.clearAllMocks();
	});

	it("should run periodically", async () => {
		jest.useFakeTimers();
		const spySync = jest.spyOn(wallet.transaction(), "sync");

		const Component = () => {
			const { pendingTransfers, pendingSigned } = useWalletTransactions(wallet);

			return <h1>{[...pendingSigned, ...pendingTransfers].length}</h1>;
		};

		render(<Component />);

		jest.advanceTimersByTime(30_000);

		await waitFor(() => expect(spySync).toHaveBeenCalledTimes(2));

		spySync.mockRestore();
		jest.useRealTimers();
	});

	it("should show only pending multisignature transactions", async () => {
		const mnemonicSignatory = await wallet.signatory().mnemonic("test");

		const transfer = await wallet
			.coin()
			.transaction()
			.transfer({
				data: {
					amount: 1,
					to: wallet.address(),
				},
				fee: 1,
				nonce: "1",
				signatory: mnemonicSignatory,
			});

		const signatory = await wallet
			.signatory()
			.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]);

		const transferWithMultisig = await wallet
			.coin()
			.transaction()
			.transfer({
				data: {
					amount: 1,
					to: wallet.address(),
				},
				fee: 1,
				nonce: "1",
				signatory,
			});

		const signedMock = jest.spyOn(wallet.transaction(), "signed").mockReturnValue({
			"1": transfer,
			"2": transferWithMultisig,
		});

		let pendingSignedTransactions: DTO.ExtendedSignedTransactionData[];
		const Component = () => {
			const { pendingSigned, syncPending } = useWalletTransactions(wallet);
			pendingSignedTransactions = pendingSigned;

			useEffect(() => {
				syncPending();
			}, [syncPending]);
			return <span>{pendingSigned.length}</span>;
		};

		render(<Component />);

		await waitFor(() => expect(pendingSignedTransactions).toHaveLength(1));

		signedMock.mockRestore();
	});
});
