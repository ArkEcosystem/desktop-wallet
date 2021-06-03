import { handleBroadcastError, isNoDeviceError, isRejectionError } from "./utils";

describe("Transaction utils", () => {
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
