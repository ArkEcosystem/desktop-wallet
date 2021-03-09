import { Environment, Profile,ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
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

	const importProfileFromDwe = async (profileData: string, password?: string) => {
		let profile: Profile;

		try {
			profile = await env.profiles().import(profileData, password);
		} catch (error) {
			if (error.message.includes("Reason: Unexpected token")) {
				throw new Error("Is encrypted");
			}
			throw error;
		}

		if (env.profiles().findByName(profile.name())) {
			throw new Error(`Profile with name ${profile.name()} already exists`);
		}

		env.profiles().fill({ [profile.id()]: profile.dump() });

		if (password) {
			env.profiles().findById(profile.id()).auth().setPassword(password);
		}
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

		return Promise.all(
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
	};

	const importProfile = async ({
		fileContent,
		fileExtension,
		password,
	}: {
		fileContent?: string;
		fileExtension?: string;
		password?: string;
	}) => {
		if (!fileContent || !fileExtension) {
			return;
		}

		if (fileExtension === ".dwe") {
			await importProfileFromDwe(fileContent, password);
		}

		if (fileExtension === ".json") {
			await importLegacyProfile(fileContent);
		}
	};

	return { openFileToImport, importProfile };
};
