import { renderHook } from "@testing-library/react-hooks";

import { useRandomNumber } from "./use-random-number";

describe("useRandomNumber", () => {
	it("should throw if minimum is not an integer", () => {
		const { result } = renderHook(() => useRandomNumber("no integer", 42));
		expect(result.error).toBeInstanceOf(Error);
	});

	it("should throw if maximum is not an integer", () => {
		const { result } = renderHook(() => useRandomNumber(42, "no integer"));
		expect(result.error).toBeInstanceOf(Error);
	});

	it("should return an integer in the given range", () => {
		const { result } = renderHook(() => useRandomNumber(1, 10));

		expect(Number.isInteger(result.current)).toBe(true);
		expect(result.current).toBeGreaterThanOrEqual(1);
		expect(result.current).toBeLessThanOrEqual(10);
	});
});
