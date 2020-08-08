import { Cache } from "./Cache";

let subject: Cache;

beforeAll(() => (subject = new Cache(10)));

describe("Cache", () => {
	it("should remember a value and return it next time without calling any functions", async () => {
		subject.flush();

		const valueFn = jest.fn(() => "value");

		await expect(subject.remember("cacheKey", valueFn)).resolves.toBe("value");
		await expect(subject.remember("cacheKey", valueFn)).resolves.toBe("value");
		await expect(subject.remember("cacheKey", valueFn)).resolves.toBe("value");
		await expect(subject.remember("cacheKey", valueFn)).resolves.toBe("value");
		await expect(subject.remember("cacheKey", valueFn)).resolves.toBe("value");

		expect(valueFn).toHaveBeenCalledTimes(1);
	});
});
