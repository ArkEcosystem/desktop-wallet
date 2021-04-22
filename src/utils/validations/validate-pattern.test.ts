import { validatePattern } from "./validate-pattern";

const translationMockFn = jest.fn().mockImplementation((text, options) => `illegal characters ${options.characters}`);

describe("validatePattern", () => {
	it("should be able to return true for valid patterns", () => {
		expect(validatePattern(translationMockFn, "loremipsumissimplydummytext", /[a-z]+/)).toBe(true);
		expect(validatePattern(translationMockFn, "0123456789", /[0-9]+/)).toBe(true);
		expect(validatePattern(translationMockFn, "!@$&_.", /[!@$&_.]+/)).toBe(true);
	});
	it("should be able to return illegal characters", () => {
		expect(validatePattern(translationMockFn, "lorem ipsum 0-1", /[a-z]+/)).toBe(
			"illegal characters ' ', '-', '0', '1'",
		);
		expect(validatePattern(translationMockFn, "0-1/2@3#", /[0-9]+/)).toBe("illegal characters '#', '-', '/', '@'");
		expect(validatePattern(translationMockFn, "!@4$5&8*9", /[!@$&_.]+/)).toBe(
			"illegal characters '*', '4', '5', '8', '9'",
		);
	});
});
