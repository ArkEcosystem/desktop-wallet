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
			.query((params) => params.page === undefined || params.page === "1")
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/devnet/transactions.json");
				return {
					meta,
					data: data.slice(0, 1),
				};
			})
			.get("/api/transactions")
			.query({ page: "2", limit: "10", address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD" })
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/devnet/transactions.json");
				return {
					meta,
					data: data.slice(1, 3),
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

	it("should sync multisignatures", async () => {
		const signatory = await wallet
			.signatory()
			.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]);

		const transfer = await wallet
			.coin()
			.transaction()
			.transfer({
				fee: "1",
				signatory,
				nonce: "1",
				data: {
					to: wallet.address(),
					amount: "1",
				},
			});

		jest.spyOn(wallet.transaction(), "sync").mockResolvedValue(void 0);
		jest.spyOn(wallet.transaction(), "broadcasted").mockReturnValue({ 1: transfer });

		const confirm = jest.spyOn(wallet.transaction(), "confirm").mockResolvedValue(true);

		const Component = () => {
			const { syncMultiSignatures } = useWalletTransactions(wallet);
			const [loading, setLoading] = useState(false);

			const run = async () => {
				setLoading(true);
				await syncMultiSignatures();
				setLoading(false);
			};
			return loading ? <span>Loading</span> : <button onClick={run}>Sync</button>;
		};

		render(<Component />);

		act(() => {
			fireEvent.click(screen.getByRole("button"));
		});

		await waitFor(() => expect(screen.queryByText("Loading")).not.toBeInTheDocument());

		expect(confirm).toHaveBeenCalled();

		jest.clearAllMocks();
	});

	it("should run periodically", async () => {
		jest.useFakeTimers();
		const spySync = jest.spyOn(wallet.transaction(), "sync");

		const Component = () => {
			const { pendingMultiSignatureTransactions } = useWalletTransactions(wallet);

			return <h1>{pendingMultiSignatureTransactions.length}</h1>;
		};

		render(<Component />);

		jest.advanceTimersByTime(50000);

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
				signatory: mnemonicSignatory,
				nonce: "1",
				fee: "1",
				data: {
					to: wallet.address(),
					amount: "1",
				},
			});

		const signatory = await wallet
			.signatory()
			.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]);

		const transferWithMultisig = await wallet
			.coin()
			.transaction()
			.transfer({
				nonce: "1",
				fee: "1",
				data: {
					to: wallet.address(),
					amount: "1",
				},
				signatory,
			});

		const signedMock = jest.spyOn(wallet.transaction(), "signed").mockReturnValue({
			"1": transfer,
			"2": transferWithMultisig,
		});

		const Component = () => {
			const { pendingMultiSignatureTransactions, syncMultiSignatures } = useWalletTransactions(wallet);

			useEffect(() => {
				syncMultiSignatures();
			}, [syncMultiSignatures]);
			return <span>{pendingMultiSignatureTransactions.length}</span>;
		};

		render(<Component />);

		// @TODO: proper expectation
		// expect(screen.getByText("1"));

		signedMock.mockRestore();
	});
});
