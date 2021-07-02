import { renderHook } from "@testing-library/react-hooks";
import { env } from "utils/testing-library";

import { useTransactionTypes } from "./use-transaction-types";

describe("useTransactionTypes", () => {
	it("should get type icon", () => {
		const { result } = renderHook(() => useTransactionTypes());

		expect(result.current.getIcon("transfer")).toBe("Transfer");
	});

	it("should get type label", () => {
		const { result } = renderHook(() => useTransactionTypes());

		expect(result.current.getLabel("transfer")).toBe("Transfer");
	});

	it("should have core types", () => {
		const { result } = renderHook(() => useTransactionTypes());

		expect(Object.keys(result.current.types)).toEqual(["core", "magistrate"]);
	});

	it("should get query params by transaction type", () => {
		const { result } = renderHook(() => useTransactionTypes());

		expect(result.current.getQueryParamsByType("transfer")).toEqual({ type: 0, typeGroup: 1 });
	});

	it("should filter only supported transaction types from wallets without magistrate", () => {
		const profile = env.profiles().first();
		const { result } = renderHook(() => useTransactionTypes({ wallets: [profile.wallets().first()] }));

		expect(result.current.types.core).toEqual([
			"delegate-registration",
			"delegate-resignation",
			"htlc-claim",
			"htlc-lock",
			"htlc-refund",
			"ipfs",
			"multi-payment",
			"multi-signature",
			"second-signature",
			"transfer",
			"vote",
		]);
	});
});
