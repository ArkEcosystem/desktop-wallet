import { Contracts, Environment } from "@arkecosystem/platform-sdk-profiles";
import { ReadableFile } from "app/hooks/use-files";

interface ImportFileProperties {
	file?: ReadableFile;
	password?: string;
}

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
		} catch {
			throw new Error("CorruptedData");
		}

		if (!data?.wallets?.length) {
			throw new Error("MissingWallets");
		}

		const profile = env.profiles().create("");

		// Ensure that we sync all coins before restoring.
		for (const wallet of data.wallets) {
			if (wallet?.address && wallet?.balance.ARK) {
				await profile.coins().set("ARK", "ark.mainnet").__construct();
			}

			if (wallet?.address && wallet?.balance.DARK) {
				await profile.coins().set("ARK", "ark.devnet").__construct();
			}
		}

		await Promise.all(
			data.wallets.map(async (wallet: Record<string, any>) => {
				if (wallet?.address && wallet?.balance.ARK) {
					const importedWallet = await profile.walletFactory().fromAddress({
						address: wallet.address,
						coin: "ARK",
						network: "ark.mainnet",
					});
					profile.wallets().push(importedWallet);
					return wallet;
				}

				if (wallet?.address && wallet?.balance.DARK) {
					profile.settings().set(Contracts.ProfileSetting.UseTestNetworks, true);

					const importedWallet = await profile.walletFactory().fromAddress({
						address: wallet.address,
						coin: "ARK",
						network: "ark.devnet",
					});
					profile.wallets().push(importedWallet);
					return importedWallet;
				}

				return null;
			}),
		);

		env.profiles().forget(profile.id());
		return profile;
	};

	const importProfile = async ({ password, file }: ImportFileProperties) => {
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
