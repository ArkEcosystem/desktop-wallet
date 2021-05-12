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
				"ODBmN2ViNWQ2OGM3ODdlZDliNmNiNGVmODdkMWFmMmQ6MzM1MTJiNmI0MzQ5NmQ0NDM2NzIzNjZkNjk0MTZkNDQ1MTcyNmU1NjY4NGM2ZjU4NmI2NTY4NGE2MjYxNDk2YzRlMzkzNDU5NTk3OTZjNTE1ODc0NzU0ODU2NmI0MzM1NzE3MzYxNjU1MDJiNjU3NjQzNjk2Nzc4Njg3YTMzNDk2YTJmNTg0MTY2MzI0NTZkNzEyZjcyNGQ3MjYzNzA2NTQ2NjUzNzQ0NTk1NjYzMmYzOTU5MzI2NDc4NmM0ZDZjNDg0YjYyNGM0ZjU3NmQ3NDc4NTk3MDM4NDY3ODRjNzc1MTZkMmIzMzUyMmI2ZTRlMzg0ODcwNzMzMzU0NTMzNjQ0MmI3YTZmNzY1NzM4Mzc3MTc4NmQ2ODU5NzY2NDRlNTg1NTJiNzY2ZjU5NDE2NTM0MmI0ODUxNTc2ZjM2NjMzNDRhNDc0MzcyNDU0MzRmNjUzNjcyMzM3Mzc3Njk2NjRhNzM2ODY1NDE0MTMxNzU2ODZkMmIzNzM5MzU0YTcwNjYzNjUwNzI0NDMxNDI0YjVhNDY3NzZjMzMzNzMyMzA0ODMwMzA0NzU0NzQ3MDZhNjczMDM3MzA2NzQ2NzU0ZTMwNGE1NjU0NjE2NzMxNzQ0YjU3NTQ0ZTZiNmUzOTZlMzM0NTMyMzU2ZjUxMzA2ZTcyNTU0NjMzNmY0NjUxMzc1NzMxMzU2NjU1NzU3MDQ4NTQ2ZDYyNmQ2MjQ2NjYzMDUzNzQ3MTU3NjI0MjQ3NTA2NDcwNDE2YTZjNzU0MjQ3MzA2YTczMzc0ZjM0NDY3NzU2NmY2ZjY3NzAyYjZkNzQ0OTYzNDM2ZjZmNTQ2ODMzMzI0NDM4NjU1YTQ4MzczODQ2NDI2YzQ4NWE0OTU2NzczNjMwNjY0MzRlMzM1NzM2NzQ2ZDZiNDY0ZDY5Nzc1ODM3NjY3NzczNmI0MzRjNjYzMzQ5NzYzMDY1NTkyYjY0NzM3MDczMzMzNjY5NDIzNTZjNGQ1NDY1NmY0MjYzNDQ1YTZjNzg1NjRlNzI0NDRiMzk1OTU2Mzc3NjM0MzI0YjMzNzUzMTY0NmIzNDUxNGQ0ZTQyNzY0YjUyNWEzODU1Nzk1MzQ1NmY3NDMxNzQ2NzZkNTk1NTMyNGE3MTc2NGI2ODQyNDY1NTZjMzkzNjY4MzE2ODMxNzE0YjM5NzM2ODZkN2E0NTQxNzQ3MjQ4NTY2NDY5NDk2ZDUxNjg0ZjdhNDE0YzZlNmQ1NTcyNjY1MTQ4NmQzNzQ5NzY0ODc4MmI2Mjc2NDc1NzU5NzMyYjc1NmYyZjM4NzA0ODRiMmYzNTY0MzQyZjRkNjk0MjU1NDE2MzRhNjkzODQyNGQ0NDM3NzI3NTY4Nzk3NDZkMzEzODRhNTA3ODc4NDI2NDMzNjc3MDM2NjE2ZjMyNmY0NDZmNjU0NjQ2NmIzNjRkMzE0NTZjNmQ3OTJmNDE2ZTU0NmE1NzQ2NmQ0NjczNGU3MTcxNGQ2NjcxMzIyZjJiMzQ2ZTcyNzI0MTJmNzMzNjU3NmQ2YjZmNGY3NTRkNzAzMzRhNDI0Yzc2Nzg1MjMxNGMzOTU2NDk1NTQ4NmE0OTc1NTQ2NTY5NmU2MTZhNDM2ZTRmMzc2Mjc0Njk2ODU1NDc0ZTMyNmY2OTY2MzU2ZTYyMzI2ZDU4NTY0ZjZjNjMzMDVhNTIzNjMxNTU2NzQ3NmYyZjcwNDQ3NTY2NTc2ZDQ5NTU1MjMyNGY2MjZjNzg1NTQ5NDY3NjU5NTA0MzY1Njk2ZTZlMzMyZjc5NmUzMjU3NGY2NTUzNzA1MTM5NzIzODYzNGY2ZjQyNjk0NDc1NTg2YjQyNTIzODMyNDQ1NjQ5NmY3NTYzNDk3MDZhNGQ3MzJmNjc1NzYxNTg2OTQ2MzU3NDY5MzMzNTcwMzYzMjRmNWE2Yzc5NDIzMTM4NzM3MTY1NGQ1ODRkNjEzODU2NDM3NjY3MzI3OTRlNGYzMjc4MzA1OTc4Nzg0OTczNjE2YzZiNmY1NTQ2MmY1NDJiNjM2MzU4NmQ3YTcxNTA3MDZjNGMzMjMxNjQ0ZDUwNGE1MDRhNTgzNTQ1Nzk3MjQyNDI0NDU2NzczNTdhNTU2NDRkNjI2NTUzMmIzMjRiNjQ3NzY2NTAzMzQ0NmE2ZTJiNmM2NzY4NmE0Zjc4NjIzNjQ3NzkzMTMwNmQzMzQyNDE2MzRjNzY2YzcwMzc0NjJiNTc2ZDcwNDk2OTc0NjM0ZDQ2NzYyZjZmNTI3NDU4NDY0ODRiNDk2MTc5MzE0NjMzNmE0NDQyNzc3YTQx";

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
