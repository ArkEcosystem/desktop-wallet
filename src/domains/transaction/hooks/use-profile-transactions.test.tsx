/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook } from "@testing-library/react-hooks";
import { ConfigurationProvider } from "app/contexts";
import nock from "nock";
import React from "react";
import { env, getDefaultProfileId, syncDelegates, useDefaultNetMocks, waitFor } from "utils/testing-library";

import { useProfileTransactions } from "./use-profile-transactions";

describe("useProfileTransactions", () => {
	beforeAll(async () => {
		useDefaultNetMocks();

		nock("https://dwallets.ark.io")
			.get("/api/transactions")
			.query(true)
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/devnet/transactions.json");
				return {
					meta,
					data: data.slice(0, 2),
				};
			})
			.persist();

		await syncDelegates();
	});

	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it("#fetchTransactions", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileTransactions({ profile, wallets: profile.wallets().values() }), { wrapper });

		const response = await current.fetchTransactions({
			wallets: profile.wallets().values(),
			cursor: 1,
			mode: "all",
			flush: true,
		});
		await waitFor(() => expect(response.items()).toHaveLength(4));

		//@ts-ignore
		const responseEmpty = await current.fetchTransactions({});
		await waitFor(() => expect(responseEmpty.hasMorePages()).toBe(false));
		await waitFor(() => expect(responseEmpty.items()).toHaveLength(0));
	});

	it("#updateFilters", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const { result } = renderHook(() => useProfileTransactions({ profile, wallets: profile.wallets().values() }), {
			wrapper,
		});

		await act(async () => {
			result.current.updateFilters({ activeMode: "sent" });
			jest.runAllTimers();

			await waitFor(() => expect(result.current.transactions).toHaveLength(0));

			result.current.updateFilters({ activeMode: "all" });
			jest.runAllTimers();

			await waitFor(() => expect(result.current.transactions).toHaveLength(0));

			const mockTransactionsAggregate = jest
				.spyOn(profile.transactionAggregate(), "sentTransactions")
				.mockImplementation(() => {
					const response = {
						hasMorePages: () => true,
						items: () => [],
					};
					return Promise.resolve(response);
				});

			result.current.updateFilters({ activeMode: "sent" });
			jest.runAllTimers();

			await waitFor(() => expect(result.current.transactions).toHaveLength(0));

			mockTransactionsAggregate.mockRestore();
		});
	});

	it("#fetchMore", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		await act(async () => {
			const { result } = renderHook(
				() => useProfileTransactions({ profile, wallets: profile.wallets().values() }),
				{ wrapper },
			);

			await waitFor(() =>
				expect(result.current.fetchTransactions({ wallets: profile.wallets().values() })).resolves.toBeTruthy(),
			);

			await result.current.fetchMore();

			await waitFor(() => expect(result.current.transactions.length).toEqual(4), { timeout: 4000 });

			const mockTransactionsAggregate = jest
				.spyOn(profile.transactionAggregate(), "transactions")
				.mockImplementation(() => {
					const response = {
						hasMorePages: () => false,
						items: () => [],
					};
					return Promise.resolve(response);
				});

			await result.current.fetchMore();

			await waitFor(() => expect(result.current.transactions.length).toEqual(4), { timeout: 4000 });
			mockTransactionsAggregate.mockRestore();
		});
	});
});
