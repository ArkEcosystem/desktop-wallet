import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { migrations } from "migrations";
import fixtureData from "tests/fixtures/env/storage.json";
import TestingPasswords from "tests/fixtures/env/testing-passwords.json";

export const migrateProfiles = async (env: Environment, profiles: any, versionToMigrate?: string) => {
	env.profiles().fill(profiles);

	return Promise.allSettled(
		env
			.profiles()
			.values()
			.map((profile) => profile.migrate(migrations, versionToMigrate || "2.0.0")),
	);
};

export const restoreProfileTestPassword = (profile: Profile) => {
	const passwords = TestingPasswords as any;
	const password = passwords?.profiles[profile.id()]?.password;

	if (password) {
		profile.auth().setPassword(password);
	}
	return profile;
};

export const migrateProfileFixtures = async (env: Environment) => {
	await migrateProfiles(env, fixtureData.profiles);
	return env.profiles().values().map(restoreProfileTestPassword);
};
