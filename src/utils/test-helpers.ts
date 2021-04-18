import { Environment, StorageData } from "@arkecosystem/platform-sdk-profiles";
import fixtureData from "tests/fixtures/env/storage.json";
import TestingPasswords from "tests/fixtures/env/testing-passwords.json";
import { Base64 } from "@arkecosystem/platform-sdk-crypto";

export const bootEnvWithProfileFixtures = async ({ env }: { env: Environment }) => {
	const ids = Object.keys(fixtureData.profiles);
	const fixtureProfiles: any = fixtureData.profiles;
	const storageData: StorageData = { profiles: {}, data: {} };

	ids.forEach((id) => {
		storageData.profiles[id] = {
			id,
			password: undefined,
			name: fixtureProfiles[id].settings.NAME,
			data: Base64.encode(JSON.stringify({ id, ...fixtureProfiles[id] })),
		};
	});

	await env.verify(storageData);
	await env.boot();

	for (const profile of env.profiles().values()) {
		await profile.restore();

		//@ts-ignore
		const storedPassword: string = TestingPasswords?.profiles[profile.id()]?.password;
		if (storedPassword) {
			profile.auth().setPassword(storedPassword);
		}

		await profile.sync();
		profile.save();
	}
};