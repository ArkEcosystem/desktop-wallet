/* eslint-disable @typescript-eslint/require-await */
import { encryptPassword } from "./EncryptPassword";

describe("EncryptPassword", () => {
	it("should confirm password", () => {
		const t = jest.fn();
		const validation = encryptPassword(t).confirmPassword("password");
		expect(validation.validate("password")).toBe(true);
	});

	it("should fail password confirmation", () => {
		const t = jest.fn();
		const validation = encryptPassword(t).confirmPassword("password");
		expect(validation.validate("wrong wrong")).toBeUndefined();
	});

	it("should not fail if password is not entered", () => {
		const t = jest.fn();
		const validation = encryptPassword(t).confirmPassword();
		expect(validation.validate("wrong wrong")).toBe(true);
	});
});
