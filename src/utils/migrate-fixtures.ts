import { Base64 } from "@arkecosystem/platform-sdk-crypto";
import { Environment, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";

// TODO: Use Migrator
export const migrateProfiles = async (env: Environment, profiles: any) => {
	env.profiles().fill(profiles);

	return Promise.allSettled(
		env
			.profiles()
			.values()
			.map(async (profile) => {
				const profileData: Record<string, any> = profile.getRawData();
				profile.setRawData({
					id: profile.id(),
					password: profile.settings().get(ProfileSetting.Password),
					data: Base64.encode(JSON.stringify({ id: profile.id(), ...profileData })),
				});

				await profile.restore();
				return profile;
			}),
	);
};

export const restoreProfilePasswords = (env: Environment, passwords: any) =>
	env
		.profiles()
		.values()
		.map((profile) => {
			const password = passwords?.profiles[profile.id()]?.password;
			if (password) {
				profile.auth().setPassword(password);
			}
			return profile;
		});
