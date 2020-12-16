import { Base64 } from "@arkecosystem/platform-sdk-crypto";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import fixtureData from "tests/fixtures/env/storage.json";

export const migrateFixtures = () => {
	const profiles: Record<string, any> = {};

	for (const [id, profileData] of Object.entries(fixtureData.profiles)) {
		profiles[id] = {
			id,
			password: undefined,
			data: Base64.encode(JSON.stringify(profileData)),
		};
	}
	return { profiles, data: fixtureData.data };
};

export const restoreProfiles = async (environment: Environment) =>
	Promise.allSettled(
		environment
			.profiles()
			.values()
			.map(async (profile) => {
				await profile.restore();

				//@ts-ignore
				const password = fixtureData.profiles[profile.id()].settings.PASSWORD;
				if (password) {
					profile.auth().setPassword(password);
				}

				return profile;
			}),
	);
