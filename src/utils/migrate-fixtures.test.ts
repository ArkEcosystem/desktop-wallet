import { ARK } from "@arkecosystem/platform-sdk-ark";
import { httpClient } from "app/services";
import fixtureData from "tests/fixtures/env/storage.json";
import TestingPasswords from "tests/fixtures/env/testing-passwords.json";
import { StubStorage } from "tests/mocks";
import { env } from "utils/testing-library";

import { migrateProfiles, restoreProfilePassword, restoreProfilePasswords } from "./migrate-fixtures";

describe("Migrate fixtures utils", () => {
	beforeAll(async () => {
		env.reset({ coins: { ARK }, httpClient, storage: new StubStorage() });

		migrateProfiles(env, fixtureData.profiles);
		restoreProfilePasswords(env, TestingPasswords);

		await env.verify();
		await env.boot();
	});

	it("should migrate profiles", () => {
		expect(fixtureData).toHaveProperty("data");
		expect(fixtureData).toHaveProperty("profiles");

		const profileIds = Object.keys(fixtureData.profiles);
		profileIds.forEach((id) => {
			//@ts-ignore
			expect(fixtureData.profiles[id]).toHaveProperty("data");
			//@ts-ignore
			expect(fixtureData.profiles[id]).toHaveProperty("id");
		});
	});

	it("should restore profile passwords", () => {
		const profileWithPassword = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		const passwordlessProfile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");

		expect(profileWithPassword.usesPassword()).toBe(true);
		expect(passwordlessProfile.usesPassword()).toBe(false);
	});

	it("should restore password for a signle profile if password is set in data", async () => {
		env.reset({ coins: { ARK }, httpClient, storage: new StubStorage() });
		migrateProfiles(env, fixtureData.profiles);

		await env.verify();
		await env.boot();

		const subject = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		expect(subject.usesPassword()).toBe(true);
		restoreProfilePassword(subject, TestingPasswords);
		expect(subject.usesPassword()).toBe(true);

		const profile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		expect(profile.usesPassword()).toBe(true);
		restoreProfilePassword(profile);
		expect(profile.usesPassword()).toBe(true);
	});

	it("should not restore password for a passwordless profile", async () => {
		env.reset({ coins: { ARK }, httpClient, storage: new StubStorage() });
		migrateProfiles(env, fixtureData.profiles);

		await env.verify();
		await env.boot();

		const profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");

		expect(profile.usesPassword()).toBe(false);
		restoreProfilePassword(profile);
		expect(profile.usesPassword()).toBe(false);
	});
});
