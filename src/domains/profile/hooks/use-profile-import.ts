import { Environment, Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import electron from "electron";
import fs from "fs";
import path from "path";

import { ImportFile } from "../pages/ImportProfile/models";

export const useProfileImport = () => {
	const readFile = (filePath: string): ImportFile => {
		const extension = path.extname(filePath);
		const content = fs.readFileSync(filePath);
		const name = path.basename(filePath);

		return { name, content: content.toString(), extension };
	};

	const openFileToImport = async ({ extensions }: { extensions: string[] }) => {
		const { filePaths } = await electron.remote.dialog.showOpenDialog({
			properties: ["openFile"],
			filters: [{ name: "", extensions }],
		});

		if (!filePaths?.length) {
			return;
		}

		return readFile(filePaths[0]);
	};

	const importProfileFromDwe = async (env: Environment, profileData: string, password?: string) => {
		let profile: Profile;

		try {
			profile = await env.profiles().import(profileData, password);
		} catch (error) {
			if (error.message.includes("Reason: Unexpected token")) {
				throw new Error("PasswordRequired");
			}
			throw error;
		}

		// // env.profiles().fill({ [profile.id()]: profile.dump() });
		//
		// if (password) {
		// 	env.profiles().findById(profile.id()).auth().setPassword(password);
		// }

		return profile;
	};

	const importLegacyProfile = async (env: Environment, profileData: string) => {
		let data: Record<string, any>;

		try {
			data = JSON.parse(profileData);
		} catch (error) {
			throw new Error("CorruptedData");
		}

		if (!data?.wallets?.length) {
			throw new Error("MissingWallets");
		}

		const profile = env.profiles().create("");

		await Promise.all(
			data.wallets.map((wallet: Record<string, any>) => {
				if (wallet?.address && wallet?.balance.ARK) {
					return profile.wallets().importByAddress(wallet.address, "ARK", "ark.mainnet");
				}

				if (wallet?.address && wallet?.balance.DARK) {
					profile.settings().set(ProfileSetting.UseTestNetworks, true);
					return profile.wallets().importByAddress(wallet.address, "DARK", "ark.devnet");
				}
			}),
		);

		env.profiles().forget(profile.id());
		return profile;
	};

	const importProfile = async ({
		password,
		env,
		file,
	}: {
		env: Environment;
		file?: ImportFile;
		password?: string;
	}) => {
		if (!file) {
			return;
		}

		if (file.extension === ".dwe") {
			return await importProfileFromDwe(env, file.content, password);
		}

		if (file.extension === ".json") {
			return await importLegacyProfile(env, file.content);
		}
	};

	return { openFileToImport, importProfile, readFile };
};
