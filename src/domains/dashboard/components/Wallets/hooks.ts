import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { uniqBy } from "@arkecosystem/utils";
import { DropdownOption } from "app/components/Dropdown";
import { useDashboardConfig } from "domains/dashboard/pages/Dashboard/hooks";
import { useMemo } from "react";

export const useWalletFilters = ({ profile }: { profile: Profile }) => {
	const { getConfiguration, setValue } = useDashboardConfig({ profile });

	const { walletsDisplayType, selectedNetworkIds, showPortfolio, showTransactions } = getConfiguration();

	const networks = useMemo(() => {
		const networks = profile
			.wallets()
			.values()
			.map((wallet) => ({
				id: wallet.network().id(),
				isLive: wallet.network().isLive(),
				name: wallet.network().name(),
				coin: wallet.network().coin(),
				isSelected: selectedNetworkIds.includes(wallet.network().id()),
			}));

		return uniqBy(networks, (n) => n.id);
	}, [profile, selectedNetworkIds]);

	const filterProperties = {
		networks,
		useTestNetworks: profile.settings().get(ProfileSetting.UseTestNetworks),
		walletsDisplayType,
		selectedNetworkIds,
		visiblePortfolioView: showPortfolio,
		visibleTransactionsView: showTransactions,
		togglePortfolioView: (showPortofolioChart: boolean) => {
			console.log("toggle portfolio view");
			setValue({ showPortfolio: showPortofolioChart });
		},
		toggleTransactionsView: (showTransactions: boolean) => {
			setValue({ showTransactions });
		},
		onWalletsDisplayType: ({ value }: DropdownOption) => {
			setValue({ walletsDisplayType: value });
		},
		onNetworkChange: (_: any, networks: any[]) => {
			setValue({ selectedNetworkIds: networks.filter((n) => n.isSelected).map((n) => n.id) });
		},
	};

	return { filterProperties };
};
