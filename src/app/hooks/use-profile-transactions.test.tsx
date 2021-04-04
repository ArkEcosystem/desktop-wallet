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

		await waitFor(() =>
			expect(current.fetchTransactions({ wallets: profile.wallets().values() })).resolves.toHaveLength(4),
		);
	});

	it("#updateFilters", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileTransactions({ profile, wallets: profile.wallets().values() }), { wrapper });

		await act(async () => {
			current.updateFilters({ activeMode: "sent" });
			await waitFor(() => expect(current.transactions).toHaveLength(0));
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
				expect(result.current.fetchTransactions({ wallets: profile.wallets().values() })).resolves.toHaveLength(
					4,
				),
			);

			await result.current.fetchMore();

			await waitFor(() => expect(result.current.transactions.length).toEqual(4), { timeout: 4000 });
		});
	});
});
