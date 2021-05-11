import { Base64 } from "@arkecosystem/platform-sdk-crypto";
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
	const storageData: StorageData = { profiles: {}, data: {} };

	ids.forEach((id) => {
		//@ts-ignore
		const password: string = TestingPasswords?.profiles[id]?.password;

		const profileData = { id, ...fixtureProfiles[id] };
		let data = Base64.encode(JSON.stringify(profileData));

		if (password) {
			// Use hardcoded enrypted data for password protected profile in fixutes, to reduce computation for tests
			data =
				"YWNkOGE0NmJhODdiZWUxYTE2MzQ1ZGViYWFlZjIxZWQ6NmM2ZTRmNTk0NDY5MzE3ODU0NTE3NzY0NmQ1NDM3NzE0MzYyNzM2NjMyN2EzNjJiNTI0NjQ0NTg3NjQ5Nzg0ODY5NGE2ODQxNjk0ODQyNTU2ZjQyNDE0Yzc0NmY0NjY1NjE0NTQ3NzM2MjU2NmIzMDM1NzM1NzY5NTQ3NzYxNTY2Nzc3NzMzMTRkNTc1OTYxNGM1NjM2MzE3OTM0N2E1Mzc2NjY2YTU5NzU2MTUxNzI0NjRkNjg2MjZmNTk3NDYxNGI0MTZiNTM1MzQ3NzU2YjMwNjc1MTQxNDI2OTQxNzQ3ODc3MzQzNzQ3NjI0NzU5NDI1Nzc4NTc2ODM0NmU1NTY2MzAzNjRjNDQyYjUwNTE3NTM0NDU1NjU5NDk3ODJiNjU1NzU3NGE1MjdhMzYzMzczNDQ0NzZiMzE3Mjc4MmI2NTMyNDQ2NTY0MzgzMzU4MzA1NTQxMmIzMzU0NjM2NDYzMzI2MTc1NTQzMTQ1NTM1MjM1NGQ1YTc0NDczNTU2NmM1NjQxMmI0NDUyNGYzODU2NDk3NjYxNGE1NjM4NGY0OTJmNDM2ZDZiNmUzMjc1NTY2ZDZkNDgzODJmNTE2NDRhNzc1OTM3NDY0MjZhNzg1Mjc2NzY3ODc3NmE0ZjQ2MmI1NzUzN2E2OTQyMzY1MjY2NWEzNTcxNjM3YTRlNGY0ODYzMzU0MzMwMzUzMzY1NzY1OTZhMzE2ZDMyNjQ3MDMzN2E2MzY0Nzc2OTZjNTM2NTM1NTc2MTU5NjY0MzYxNGIzOTMwNzY3MjYyNDM1MTZhNTI1NTcwNzMzMTVhNDU1NDYxNDYzNzYxNzMyZjRhNzg0Yjc0NmQzNDRiNjk1MDZmNWE1NDQyNGI2MzU4MzE2MzQ5NzkzNDVhNTU3Njc2NDI3MDM5N2EzMDQ4NTY0YTRjNmUzNjc5NzM1NDcyMzYzMjZlNGY3NjM0Njg3ODMxNWE2ZjUxMzczNzUzNTM3NTRlNzE3OTY5NDYzODVhNmQ0ZDQ4NDg2YTUyMzY2NzRkNTQ2MzYzNmE2MTM0NDU2YzY5MzM0NzYzNGEzODMyNGIyZjM4NTk1NDM5Njg2NjM4NDc3YTY0NTE2ZTc3NjgzMTQxNTE0ODM4NGIzOTYyMzc1YTc1NmI2MjczNjY3MTU2NjE2NTUyNjM3MTU2Njc0YTUzMmI3NjU1NjQ1Nzc2NTM3Mjc0NDk2ZTRiNzc2ZjZhNzYzODQ1NGM0Mjc0Nzk2OTQ2Mzg1MDc3NTY2MTc5NGU1MDY0NGI0NjZjNGE0NzZkMmI1NzQ2NDkzNTQ2NjI2NzU0MzY1NzQ4Nzk1NTQ2MzY0MzQxNTMzMDc2NTA3MTZjN2E2ODRkNTY2NTU0NmIzMTc4MzM0YjcyNjM0MzMwNjE0ZTc2Nzc1NDcxMzU2YzU1MzE2NzU2Mzk1NDc4Njg3NDQzNzU2NDRmNmY0YTYxMzc2MTRiNzI3Njc5NzQ3MTRjNmYzNjQzNzA1YTY1NzQ3MjZiNzU0Yjc0MzMzNDQ5Mzk2MTJiNjYzNzUxNGU2YzZlNjUyZjY0MmY0NDMwNzQ2ZTM4NTk2ZDYxNzU1NjU4MzE1NDQ0NGQ0NTVhNTgyZjU3Mzk2ZjU4NmU3NzZkNzQ2YzdhNzQ3NjRiMzIzOTM2NzQ3NzY5NDc2NTZkNjg3ODUzMzY0YzM0NTk2NjY0NmY2NTRlNmMzNjY4NWEzOTUxNDc2YjQ2Nzg2YTY0NTk2MTMxNDU3MDU3NDIzMjcwNzU3MzZiNDI1NTM2NGY2ZTJiMmI0ZDZmNDQ1MzRkNjg1NjQ2NGQ3MTQ3MzY0ZTc4NGY3MzcwMmY2MzVhNDEzODY0MzA2ZTZkNTE2YzZiNzUzMjY0NTM0YzU4NzkzMDY0NDQ0NTMzNDg3NDY3NmQ1OTUyMzc3YTY2NDUzMTcwNDE1YTcxNTc2MzQyNjM1YTZkNTE3MjZjNzY1MDQ2NmI3NTMxNGU2MTM1Mzc0ZjM2Njc3ODcxNzIyZjRjNzkzMDMwNjczNDU0NjgyYjc2NTg1NzU2NTg3NjRjMzY0YzMxNDMyYjQ0NGM2OTM1NTEzMzRlNDk2ZTQ4NDY2OTMwNGU0Zjc5NjU0NDc0Mzg2YjY3MzA0NjVhNzA1NDc1NzA0YTY3NDY3NzM4NjU0ZTU2NGQzNjJiNjI3NjM3NGU0NjRlNDUzOTU0Njg0YjM3NTAzNjZlNGY2Yjc5Njk0MTYxNmM1MTc3NDI3NTYyNTY1MDRmNjY0ZTU0NmUyZjU0NDgzMzQzNzg1MjMzNzU2YzQ2";

			// Use the following code to generate password protected data
			// data = Base64.encode(
			// 	PBKDF2.encrypt(
			// 		JSON.stringify({
			// 			id: profileData.id,
			// 			name: profileData.settings.NAME,
			// 			avatar: undefined,
			// 			password: profileData.settings.PASSWORD,
			// 			data: profileData,
			// 		}),
			// 		password,
			// 	),
			// );
		}

		storageData.profiles[id] = {
			id,
			password: fixtureProfiles[id].settings.PASSWORD,
			name: fixtureProfiles[id].settings.NAME,
			data,
		};
	});

	await env.verify(storageData);
	await env.boot();

	await env.profiles().restore(env.profiles().last(), "password");

	if (shouldRestoreDefaultProfile) {
		const profile = env.profiles().first();
		await env.profiles().restore(profile);

		await profile.sync();
	}
};

export const isE2E = () => (["true", "1"].includes(process.env.REACT_APP_IS_E2E?.toLowerCase() || "") ? true : false);

export const isUnit = () => (["true", "1"].includes(process.env.REACT_APP_IS_UNIT?.toLowerCase() || "") ? true : false);
