import { Cache } from "./Cache";

let subject: Cache;

beforeAll(() => (subject = new Cache(10)));

describe("Cache", () => {
	it("should remember a value if it is a string", async () => {
		subject.flush();

		await expect(subject.remember("cacheKey", "value")).resolves.toBe("value");
	});

	it("should remember a value if it is a function", async () => {
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
