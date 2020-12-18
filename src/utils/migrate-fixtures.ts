import { Base64 } from "@arkecosystem/platform-sdk-crypto";
import { Environment, Profile,ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import TestingPasswords from "tests/fixtures/env/testing-passwords.json";

// TODO: Use Migrator
export const migrateProfiles = (env: Environment, profiles: any) => {
	env.profiles().fill(profiles);

	return env
		.profiles()
		.values()
		.map((profile: Profile) => {
			const profileData: Record<string, any> = profile.getRawData();

			profile.setRawData({
				id: profile.id(),
				password: profile.settings().get(ProfileSetting.Password),
				data: Base64.encode(JSON.stringify({ id: profile.id(), ...profileData })),
			});

			// Have migrated data available before restore. No need to sync for wallets
			profile.peers().fill(profileData.peers);
			profile.notifications().fill(profileData.notifications);
			profile.data().fill(profileData.data);
			profile.plugins().fill(profileData.plugins);
			profile.settings().fill(profileData.settings);

			return profile;
		});
};

export const restoreProfilePassword = (profile: Profile, passwords: any = TestingPasswords) => {
	const password = passwords?.profiles[profile.id()]?.password;
	if (password) {
		profile.auth().setPassword(password);
	}
	return profile;
};

export const restoreProfilePasswords = (env: Environment, passwords: any = TestingPasswords) =>
	env
		.profiles()
		.values()
		.map((profile: Profile) => {
			const password = passwords?.profiles[profile.id()]?.password;
			if (password) {
				profile.auth().setPassword(password);
			}
			return profile;
		});
