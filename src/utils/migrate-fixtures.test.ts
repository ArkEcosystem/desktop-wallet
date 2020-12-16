import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import { StubStorage } from "tests/mocks";

import { migrateFixtures, restoreProfiles } from "./migrate-fixtures";

let env: Environment;
const fixtureData = migrateFixtures();

describe("Migrate fixtures utils", () => {
	beforeAll(async () => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage(fixtureData) });
		await env.verify();
		await env.boot();
	});

	it("should migrate fixtures from env storage", () => {
		expect(fixtureData).toHaveProperty("data");
		expect(fixtureData).toHaveProperty("profiles");

		const profileIds = Object.keys(fixtureData.profiles);
		profileIds.forEach((id) => {
			expect(fixtureData.profiles[id]).toHaveProperty("data");
			expect(fixtureData.profiles[id]).toHaveProperty("id");
		});
	});

	it("should restore all profiles", async () => {
		console.log(env.profiles().values());
		const profileIds = Object.keys(fixtureData.profiles);

		profileIds.forEach((id) => {
			expect(env.profiles().findById(id).id()).toEqual(id);
			expect(env.profiles().findById(id).name()).toBeUndefined;
		});

		await restoreProfiles(env);

		profileIds.forEach((id) => {
			expect(env.profiles().findById(id).id()).toEqual(id);
			expect(env.profiles().findById(id).name()).not.toBeUndefined();
		});
	});
});
