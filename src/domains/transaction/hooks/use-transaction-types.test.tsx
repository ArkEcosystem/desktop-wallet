import { renderHook } from "@testing-library/react-hooks";

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
		expect(result.current.getQueryParamsByType("businessEntityRegistration")).toEqual({
			type: 6,
			typeGroup: 2,
			asset: {
				type: 0,
				action: 0,
			},
		});
	});
});
