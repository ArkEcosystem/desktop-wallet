import { Environment, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import electron from "electron";
import fs from "fs";
import path from "path";

export const useProfileImport = ({ env }: { env: Environment }) => {
	const openFileToImport = async () => {
		const { filePaths } = await electron.remote.dialog.showOpenDialog({
			properties: ["openFile"],
			filters: [{ name: "", extensions: ["dwe", "json"] }],
		});

		if (!filePaths?.length) {
			return {};
		}

		const fileExtension = path.extname(filePaths[0]);
		const fileContent = fs.readFileSync(filePaths[0]);

		return { fileExtension, fileContent: fileContent.toString() };
	};

	const importProfileFromDwe = async (profileData: string) => {
		const profile = await env.profiles().import(profileData);

		if (env.profiles().findByName(profile.name())) {
			throw new Error(`Profile with name ${profile.name()} already exists`);
		}

		env.profiles().fill({ [profile.id()]: profile.dump() });
	};

	const importLegacyProfile = async (profileData: string) => {
		let data: Record<string, any>;

		try {
			data = JSON.parse(profileData);
		} catch (error) {
			throw new Error("Unable to parse data due to corrupted format");
		}

		if (!data?.wallets?.length) {
			throw new Error("Unable to find wallet information in the exported file");
		}

		const profile = env.profiles().create("V2 Import");

		for (const wallet of data.wallets) {
			if (wallet?.address && wallet?.balance.ARK) {
				await profile.wallets().importByAddress(wallet.address, "ARK", "ark.mainnet");
			}

			if (wallet?.address && wallet?.balance.DARK) {
				await profile.wallets().importByAddress(wallet.address, "DARK", "ark.devnet");
				profile.settings().set(ProfileSetting.UseTestNetworks, true);
			}
		}
	};

	const importProfile = async ({ fileContent, fileExtension }: { fileContent?: string; fileExtension?: string }) => {
		if (!fileContent || !fileExtension) {
			return;
		}

		if (fileExtension === ".dwe") {
			await importProfileFromDwe(fileContent);
		}

		if (fileExtension === ".json") {
			await importLegacyProfile(fileContent);
		}
	};

	return { openFileToImport, importProfile };
};
