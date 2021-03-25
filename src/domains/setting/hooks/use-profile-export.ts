import { Contracts,Helpers } from "@arkecosystem/platform-sdk-profiles";

interface ProfileExportOptions {
	excludeEmptyWallets: boolean;
	excludeLedgerWallets: boolean;
}

export const useProfileExport = (profile: Contracts.IProfile) => {
	const formatExportData = (filters: ProfileExportOptions) => {
		let password;

		if (profile.usesPassword()) {
			password = Helpers.MemoryPassword.get(profile);
		}

		return profile.export(password, {
			...filters,
			addNetworkInformation: true,
			saveGeneralSettings: true,
		});
	};

	return { formatExportData };
};
