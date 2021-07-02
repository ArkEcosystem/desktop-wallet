import { shuffleOptions } from "./shuffleOptions";

describe("#shuffleOptions", () => {
	const options = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];
	const value = "b";
	const limit = 7;

	it("should get diff results", () => {
		const result1 = shuffleOptions({ limit, options, value });
		const result2 = shuffleOptions({ limit, options, value });

		expect(result1).not.toEqual(result2);
	});

	it("should contain the value", () => {
		for (let index = 0; index < 10; index++) {
			expect(shuffleOptions({ limit, options, value })).toContain(value);
		}
	});

	it("should get limit length", () => {
		for (let index = 0; index < 10; index++) {
			expect(shuffleOptions({ limit, options, value })).toHaveLength(limit);
		}
	});
});
