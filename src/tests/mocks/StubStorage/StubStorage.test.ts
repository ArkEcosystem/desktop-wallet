import { StubStorage } from "./StubStorage";

describe("StubStorage", () => {
	const stubStorage = new StubStorage();

	beforeEach(function () {
		stubStorage.flush();
	});

	it("should return current storage", async () => {
		expect(await stubStorage.all()).toEqual({});
	});

	it("should return set and get an entry into storage", async () => {
		await stubStorage.set("item", "bleh");

		expect(await stubStorage.get("item")).toEqual("bleh");
	});

	it("should return set and get an entry into storage", async () => {
		await stubStorage.set("item", "bleh");

		expect(await stubStorage.get("item")).toEqual("bleh");
	});

	it("should check if the storage has a key", async () => {
		await stubStorage.set("item", "bleh");

		expect(await stubStorage.has("item")).toEqual(true);
	});

	it("should forget a key", async () => {
		await stubStorage.set("item", "bleh");
		await stubStorage.forget("item");

		expect(await stubStorage.has("item")).toEqual(false);
	});

	it("should flush the storage", async () => {
		await stubStorage.set("item", "bleh");
		await stubStorage.flush();

		expect(await stubStorage.all()).toEqual({});
	});

	it("should return count", async () => {
		expect(await stubStorage.count()).toEqual(0);
	});

	it("should restore", async () => {
		expect(await stubStorage.restore()).toEqual(undefined);
	});
	it("should snapshot", async () => {
		expect(await stubStorage.snapshot()).toEqual(undefined);
	});
});
