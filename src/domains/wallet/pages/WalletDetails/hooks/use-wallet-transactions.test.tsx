import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { env, getDefaultProfileId, render, waitFor } from "utils/testing-library";

import { useWalletTransactions } from "./use-wallet-transactions";

describe("Wallet Transactions Hook", () => {
	let wallet: ReadWriteWallet;
	let profile: Profile;

	beforeAll(() => {
		nock("https://dwallets.ark.io")
			.post("/api/transactions/search")
			.query(true)
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/transactions.json");
				return {
					meta,
					data: data.slice(0, 1),
				};
			})
			.persist();
	});
	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
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
	});
});
