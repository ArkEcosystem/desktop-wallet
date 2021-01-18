import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { migrations } from "migrations";
import fixtureData from "tests/fixtures/env/storage.json";
import TestingPasswords from "tests/fixtures/env/testing-passwords.json";

export const migrateProfiles = async (env: Environment, profiles: any, versionToMigrate?: string) => {
	env.profiles().fill(profiles);

	for (const profile of env.profiles().values()) {
		try {
			await profile.migrate(migrations, versionToMigrate || "2.0.0");
		} catch (error) {
			throw new Error(`Migration failed for profile [${profile.id()}]. Reason: ${error.message}`);
		}
	}
};

export const restoreProfileTestPassword = (profile: Profile) => {
	const passwords = TestingPasswords as any;
	const password = passwords?.profiles[profile.id()]?.password;

	if (password) {
		profile.auth().setPassword(password);
	}

	return profile;
};

export const migrateProfileFixtures = async (env: Environment, versionToMigrate?: string) => {
	await migrateProfiles(env, fixtureData.profiles, versionToMigrate);
	return env.profiles().values().map(restoreProfileTestPassword);
};
