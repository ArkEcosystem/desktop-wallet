import { evaluateFee } from "./utils";

describe("Transaction utils", () => {
	describe("Evalute Fee", () => {
		it("should return the right fee when object", () => {
			const fee = evaluateFee({ display: "1", value: "100000000" });
			expect(fee.toString()).toEqual("100000000");
		});

		it("should return the right fee when plain", () => {
			const fee = evaluateFee("100000000");
			expect(fee.toString()).toEqual("100000000");
		});
	});
});
