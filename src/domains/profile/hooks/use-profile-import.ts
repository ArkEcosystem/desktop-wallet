import { Environment, Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { ImportFile } from "app/hooks/use-files";

type ImportFileProps = {
	env: Environment;
	file?: ImportFile;
	password?: string;
};

export const useProfileImport = () => {
	const importProfileFromDwe = async (env: Environment, profileData: string, password?: string) => {
		let profile: Profile;

		try {
			profile = await env.profiles().import(profileData, password);
		} catch (error) {
			if (error.message.includes("Reason: Unexpected token") && !password) {
				throw new Error("PasswordRequired");
			}

			if (error.message.includes("Reason: Unexpected token") && password) {
				throw new Error("InvalidPassword");
			}

			throw error;
		}

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

				return null;
			}),
		);

		env.profiles().forget(profile.id());
		return profile;
	};

	const importProfile = async ({ password, env, file }: ImportFileProps) => {
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

	return { importProfile };
};
