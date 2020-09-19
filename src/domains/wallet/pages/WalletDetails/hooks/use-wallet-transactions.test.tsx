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
			.post("/api/transactions/search")
			.query({ page: "1", limit: "10" })
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/transactions.json");
				return {
					meta,
					data: data.slice(0, 1),
				};
			})
			.post("/api/transactions/search")
			.query({ page: "2", limit: "10" })
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/transactions.json");
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
});
