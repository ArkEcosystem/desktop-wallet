import { runUnknownCode } from "./vm";

describe("VM", () => {
	afterAll(() => {
		jest.clearAllMocks();
	});

	it("should run with callback", () => {
		const incrementFunction = runUnknownCode("module.exports = (value) => value + 1", "./index.js");

		expect(incrementFunction(1)).toBe(2);
	});
});
