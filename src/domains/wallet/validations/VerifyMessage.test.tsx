import { verifyMessage } from "./VerifyMessage";

describe("VerifyMessage", () => {
	it("should validate jsonString", () => {
		const t = jest.fn();
		const validation = verifyMessage(t).jsonString();
		const json = { message: "2", signatory: "1", signature: "3" };

		expect(validation.validate.valid(JSON.stringify(json))).toBe(true);
	});

	it("should fail validation for jsonString", () => {
		const t = jest.fn();
		const validation = verifyMessage(t).jsonString();
		const json = { signatory: "1", signature: "3" };

		expect(validation.validate.valid(JSON.stringify(json))).not.toBe(true);

		expect(validation.validate.valid("wrong json.")).not.toBe(true);
	});
});
