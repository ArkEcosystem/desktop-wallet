import { renderHook } from "@testing-library/react-hooks";

import { useCurrencyDisplay } from "./use-currency-display";

describe("useCurrencyDisplay hook", () => {
	it("should format range", () => {
		const {
			result: { current },
		} = renderHook(() => useCurrencyDisplay());

		const max = "30000";
		const fromCurrency = current.formatRange({ display: "25", value: "2500000000" }, max);
		expect(fromCurrency).toEqual([25]);

		const fromNumber = current.formatRange(10, max);
		expect(fromNumber).toEqual([10]);

		const fromString = current.formatRange("10", max);
		expect(fromString).toEqual([10]);

		const limitToMax = current.formatRange("10", "1");
		expect(limitToMax).toEqual([1]);
	});

	it("should convert to currency", () => {
		const {
			result: { current },
		} = renderHook(() => useCurrencyDisplay());

		const fromCurrency = current.convertToCurrency({ display: "25", value: "2500000000" });
		expect(fromCurrency).toEqual({ display: "25", value: "2500000000" });

		const fromNumber = current.convertToCurrency(25);
		expect(fromNumber).toEqual({ display: "25", value: "2500000000" });

		const fromString = current.convertToCurrency("25");
		expect(fromString).toEqual({ display: "25", value: "2500000000" });
	});
});
