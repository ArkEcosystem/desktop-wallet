import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";

type ExportFilters = {
	excludeWalletsWithoutName?: boolean;
	excludeEmptyWallets?: boolean;
	excludeLedgerWallets?: boolean;
	addWalletNetworkInfo?: boolean;
	saveGeneralCustomizations?: boolean;
};

export const useProfileExport = (profile: Profile) => {
	const formatExportData = (filters: ExportFilters) => {
		const wallets = profile
			.wallets()
			.values()
			.filter((wallet: ReadWriteWallet) => {
				if (filters.excludeLedgerWallets && wallet.isLedger()) {
					return false;
				}

				if (filters.excludeWalletsWithoutName && !wallet.alias()) {
					return false;
				}

				if (filters.excludeEmptyWallets && wallet.balance().isGreaterThan(0)) {
					return false;
				}

				return true;
			})
			.map((wallet) => ({
				address: wallet.address(),
				publicKey: wallet.publicKey(),
				balance: wallet.balance().toHuman(),
				...(filters.addWalletNetworkInfo && { network: wallet.network().toObject() }),
			}));

		return {
			meta: {
				walletsCount: wallets.length,
			},
			...(filters.saveGeneralCustomizations && { settings: profile.settings().all() }),
			wallets,
		};
	};

	return { formatExportData };
};
