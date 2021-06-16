import "jest-extended";

import { lowerCaseEquals } from "./equals";

describe("#lowerCaseEquals", () => {
	it("should be false because of A", () => {
		expect(lowerCaseEquals(undefined, 'B')).toBeFalse();
	});

	it("should be false because of B", () => {
		expect(lowerCaseEquals('A', undefined)).toBeFalse();
	});

	it("should be false because A and B are not equal", () => {
		expect(lowerCaseEquals('A', 'B')).toBeFalse();
	});

	it("should be true because A and B are equal", () => {
		expect(lowerCaseEquals('A', 'A')).toBeTrue();
	});
});
