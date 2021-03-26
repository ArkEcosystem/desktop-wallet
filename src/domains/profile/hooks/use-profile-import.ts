import { Contracts, Environment } from "@arkecosystem/platform-sdk-profiles";
import { ReadableFile } from "app/hooks/use-files";

type ImportFileProps = {
	file?: ReadableFile;
	password?: string;
};

export const useProfileImport = ({ env }: { env: Environment }) => {
	const importProfileFromDwe = async (profileData: string, password?: string) => {
		let profile: Contracts.IProfile;

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

	const importLegacyProfile = async (profileData: string) => {
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
					profile.settings().set(Contracts.ProfileSetting.UseTestNetworks, true);
					return profile.wallets().importByAddress(wallet.address, "ARK", "ark.devnet");
				}

				return null;
			}),
		);

		env.profiles().forget(profile.id());
		return profile;
	};

	const importProfile = async ({ password, file }: ImportFileProps) => {
		if (!file) {
			return;
		}

		if (file?.extension === ".dwe") {
			return await importProfileFromDwe(file.content, password);
		}

		if (file?.extension === ".json") {
			return await importLegacyProfile(file.content);
		}
	};

	return { importProfile };
};
