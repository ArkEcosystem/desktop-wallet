/* eslint-disable unicorn/no-null */

import { Profile } from "@arkecosystem/platform-sdk-profiles";

import { assertNumber, assertProfile, assertString } from "./assertions";

describe("#assertProfile", () => {
	it("should pass with a profile instance", () => {
		expect(() =>
			assertProfile(
				new Profile({
					id: "id",
					name: "John Doe",
					data: "{}",
				}),
			),
		).not.toThrow();
	});

	it("should fail without a profile instance", () => {
		expect(() => assertProfile(undefined)).toThrow("Expected 'profile' to be defined, but received undefined");
		expect(() => assertProfile(null)).toThrow("Expected 'profile' to be defined, but received null");
		expect(() => assertProfile(true)).toThrow("Expected 'profile' to be defined, but received true");
		expect(() => assertProfile(false)).toThrow("Expected 'profile' to be defined, but received false");
		expect(() => assertProfile("")).toThrow("Expected 'profile' to be defined, but received ");
		expect(() => assertProfile("a")).toThrow("Expected 'profile' to be defined, but received a");
		expect(() => assertProfile(1)).toThrow("Expected 'profile' to be defined, but received 1");
		expect(() => assertProfile({})).toThrow("Expected 'profile' to be defined, but received [object Object]");
		expect(() => assertProfile([])).toThrow("Expected 'profile' to be defined, but received ");
	});
});

describe("#assertString", () => {
	it("should pass with a string", () => {
		expect(() => assertString("a")).not.toThrow();
		expect(() => assertString(Number(1).toString())).not.toThrow();
	});

	it("should fail without a string", () => {
		expect(() => assertString(undefined)).toThrow("Expected 'value' to be string, but received undefined");
		expect(() => assertString(null)).toThrow("Expected 'value' to be string, but received null");
		expect(() => assertString(true)).toThrow("Expected 'value' to be string, but received true");
		expect(() => assertString(false)).toThrow("Expected 'value' to be string, but received false");
		expect(() => assertString("")).toThrow("Expected 'value' to be string, but received ");
		expect(() => assertString(1)).toThrow("Expected 'value' to be string, but received 1");
		expect(() => assertString({})).toThrow("Expected 'value' to be string, but received [object Object]");
		expect(() => assertString([])).toThrow("Expected 'value' to be string, but received ");
	});
});

describe("#assertNumber", () => {
	it("should pass with a number", () => {
		expect(() => assertNumber(1)).not.toThrow();
		expect(() => assertNumber(3.1)).not.toThrow();
		expect(() => assertNumber(Number(1))).not.toThrow();
		expect(() => assertNumber(Number.MAX_SAFE_INTEGER)).not.toThrow();
	});

	it("should fail without a number", () => {
		expect(() => assertNumber(undefined)).toThrow("Expected 'value' to be number, but received undefined");
		expect(() => assertNumber(null)).toThrow("Expected 'value' to be number, but received null");
		expect(() => assertNumber(true)).toThrow("Expected 'value' to be number, but received true");
		expect(() => assertNumber(false)).toThrow("Expected 'value' to be number, but received false");
		expect(() => assertNumber("")).toThrow("Expected 'value' to be number, but received ");
		expect(() => assertNumber("1")).toThrow("Expected 'value' to be number, but received 1");
		expect(() => assertNumber({})).toThrow("Expected 'value' to be number, but received [object Object]");
		expect(() => assertNumber([])).toThrow("Expected 'value' to be number, but received ");
		expect(() => assertNumber(Number.NaN)).toThrow("Expected 'value' to be number, but received NaN");
		expect(() => assertNumber(Number.MAX_SAFE_INTEGER + 1)).toThrow(
			"Expected 'value' to be number, but received 9007199254740992",
		);
	});
});
