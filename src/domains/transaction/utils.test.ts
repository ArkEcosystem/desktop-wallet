import { evaluateFee, handleBroadcastError,isNoDeviceError, isRejectionError } from "./utils";

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

	describe("isNoDeviceError", () => {
		it("should return isNoDeviceError", () => {
			const error = isNoDeviceError("no device found");
			expect(error).toEqual(true);
		});
	});

	describe("isRejectionError", () => {
		it("should return isRejectionError", () => {
			const error = isRejectionError("Condition of use not satisfied");
			expect(error).toEqual(true);
		});
	});

	describe("handleBroadcastError", () => {
		it("should throw if rejected", () => {
			expect(() =>
				handleBroadcastError({ rejected: ["id"], errors: { id: "ERROR" }, accepted: [] }),
			).toThrowError("ERROR");
		});
		it("should not throw if accepted", () => {
			expect(() => handleBroadcastError({ rejected: [], errors: {}, accepted: ["id"] })).not.toThrow();
		});
	});
});
