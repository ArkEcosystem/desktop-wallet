import { Base64, PBKDF2 } from "@arkecosystem/platform-sdk-crypto";
import { Environment, StorageData } from "@arkecosystem/platform-sdk-profiles";
import fixtureData from "tests/fixtures/env/storage.json";
import TestingPasswords from "tests/fixtures/env/testing-passwords.json";

export const bootEnvWithProfileFixtures = async ({
	env,
	shouldRestoreDefaultProfile = false,
}: {
	env: Environment;
	shouldRestoreDefaultProfile?: boolean;
}) => {
	const ids = Object.keys(fixtureData.profiles);
	const fixtureProfiles: any = fixtureData.profiles;
	const storageData: StorageData = { data: {}, profiles: {} };

	for (const id of ids) {
		//@ts-ignore
		const password: string = TestingPasswords?.profiles[id]?.password;

		const profileData = { id, ...fixtureProfiles[id] };
		let data = Base64.encode(JSON.stringify(profileData));

		if (password) {
			data = Base64.encode(
				PBKDF2.encrypt(
					JSON.stringify({
						avatar: undefined,
						data: profileData,
						id: profileData.id,
						name: profileData.settings.NAME,
						password: profileData.settings.PASSWORD,
					}),
					password,
				),
			);
		}

		storageData.profiles[id] = {
			data,
			id,
			name: fixtureProfiles[id].settings.NAME,
			password: fixtureProfiles[id].settings.PASSWORD,
		};
	}

	await env.verify(storageData);
	await env.boot();

	await env.profiles().restore(env.profiles().last(), "password");

	if (shouldRestoreDefaultProfile) {
		const profile = env.profiles().first();
		await env.profiles().restore(profile);

		await profile.sync();
	}
};

export const isE2E = () => !!["true", "1"].includes(process.env.REACT_APP_IS_E2E?.toLowerCase() || "");

export const isUnit = () => !!["true", "1"].includes(process.env.REACT_APP_IS_UNIT?.toLowerCase() || "");
