import { validateFee } from "./Fee";

describe("Fee validation", () => {
	it("should return a warning message", () => {
		expect(validateFee({ display: "0.001", value: "100" }, "10000")).toEqual(
			"TRANSACTION.PAGE_TRANSACTION_SEND.VALIDATION.FEE_BELOW_MINIMUM",
		);
	});

	it("should not return a warning message", () => {
		expect(validateFee({ display: "0.1", value: "10000" }, "1000")).toEqual("");
	});

	it("should not return a warning message if no fee", () => {
		expect(validateFee(undefined, "1000")).toEqual("");
	});
});
