import { runUnknownCode } from "./vm";

describe("VM", () => {
	afterAll(() => {
		jest.clearAllMocks();
	});

	it("should run with callback", () => {
		const incrementFn = runUnknownCode("module.exports = (value) => value + 1", "./index.js");
		expect(incrementFn(1)).toBe(2);
	});
});
