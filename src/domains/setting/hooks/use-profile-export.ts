import { MemoryPassword, Profile } from "@arkecosystem/platform-sdk-profiles";

interface ProfileExportOptions {
	excludeWalletsWithoutName: boolean;
	excludeEmptyWallets: boolean;
	excludeLedgerWallets: boolean;
}

export const useProfileExport = (profile: Profile) => {
	const formatExportData = (filters: ProfileExportOptions) => {
		let password;

		if (profile.usesPassword()) {
			password = MemoryPassword.get(profile);
		}

		return profile.export(password, {
			...filters,
			addNetworkInformation: true,
			saveGeneralSettings: true,
		});
	};

	return { formatExportData };
};
