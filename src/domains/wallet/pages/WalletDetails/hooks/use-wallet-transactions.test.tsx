import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { useWalletTransactions } from "./use-wallet-transactions";

describe("Wallet Transactions Hook", () => {
	let wallet: ReadWriteWallet;
	let profile: Profile;

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

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
	});

	it("should fetch more", async () => {
		const Component = () => {
			const { fetchMore, transactions } = useWalletTransactions(wallet, { limit: 10 });
			return (
				<div>
					<ul>
						{transactions.map((item) => (
							<li key={item.id()}>{item.id()}</li>
						))}
					</ul>
					<button onClick={fetchMore}>More</button>
				</div>
			);
		};

		render(<Component />);

		act(() => {
			fireEvent.click(screen.getByRole("button"));
		});

		await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(1));

		act(() => {
			fireEvent.click(screen.getByRole("button"));
		});

		await act(async () => {
			await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(3));
		});
	});

	it("should run periodically", async () => {
		jest.useFakeTimers();
		const spyTransactions = jest.spyOn(wallet, "transactions");

		const Component = () => {
			const { transactions } = useWalletTransactions(wallet, { limit: 10 });
			return <h1>{transactions.length}</h1>;
		};

		render(<Component />);

		jest.advanceTimersByTime(40000);

		await waitFor(() => expect(spyTransactions).toHaveBeenCalledTimes(2));

		spyTransactions.mockRestore();
		jest.useRealTimers();
	});

	it("should be no more on initial render", () => {
		const Component = () => {
			const { hasMore } = useWalletTransactions(wallet, { limit: 10 });

			return <span>{hasMore ? "More" : "Empty"}</span>;
		};

		render(<Component />);

		expect(screen.getByText("Empty")).toBeInTheDocument();
	});

	it("should show only pending multisignature transactions", async () => {
		const transfer = await wallet
			.coin()
			.transaction()
			.transfer({
				from: "DM7UiH4b2rW2Nv11Wu6ToiZi8MJhGCEWhP",
				nonce: "1",
				fee: "1",
				data: {
					to: wallet.address(),
					amount: "1",
				},
				sign: {
					mnemonic: "test",
				},
			});

		const transferWithMultisig = await wallet
			.coin()
			.transaction()
			.transfer({
				from: "DM7UiH4b2rW2Nv11Wu6ToiZi8MJhGCEWhP",
				nonce: "1",
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

		const signedMock = jest.spyOn(wallet.transaction(), "signed").mockReturnValue({
			"1": transfer,
			"2": transferWithMultisig,
		});

		const Component = () => {
			const { pendingMultiSignatureTransactions } = useWalletTransactions(wallet, { limit: 10 });

			return <span>{pendingMultiSignatureTransactions.length}</span>;
		};

		render(<Component />);

		expect(screen.getByText("1"));

		signedMock.mockRestore();
	});
});
