import { renderHook } from "@testing-library/react-hooks";
import { env } from "utils/testing-library";

import { useTransactionTypes } from "./use-transaction-types";

describe("useTransactionTypes", () => {
	it("should get type label", () => {
		const { result } = renderHook(() => useTransactionTypes());
		expect(result.current.getLabel("transfer")).toBe("Transfer");
	});

	it("should have core and magistrate types", () => {
		const { result } = renderHook(() => useTransactionTypes());
		expect(Object.keys(result.current.types)).toEqual(["core", "magistrate"]);
	});

	it("should get query params by transaction type", () => {
		const { result } = renderHook(() => useTransactionTypes());
		expect(result.current.getQueryParamsByType("transfer")).toEqual({ type: 0, typeGroup: 1 });
		expect(result.current.getQueryParamsByType("business-registration")).toEqual({
			type: 6,
			typeGroup: 2,
			asset: {
				type: 0,
				action: 0,
			},
		});
	});

	it("should filter only supported transaction types from wallets", () => {
		const profile = env.profiles().first();
		const { result } = renderHook(() => useTransactionTypes({ wallets: [profile.wallets().first()] }));
		expect(result.current.types.core).toEqual(profile.wallets().first().transactionTypes());
	});
});
