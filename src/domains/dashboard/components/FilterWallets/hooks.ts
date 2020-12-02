import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { isEqual, pick, uniqBy } from "@arkecosystem/utils";
import { useDashboardConfig } from "domains/dashboard/pages/Dashboard/hooks";
import { useMemo } from "react";

import { FilterWalletsHookProps } from "./";

export const useWalletFilters = ({ profile }: { profile: Profile }) => {
	const { getConfiguration, defaultConfiguration } = useDashboardConfig({ profile });
	const { walletsDisplayType, selectedNetworkIds, showPortfolio, showTransactions, viewType } = getConfiguration();

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

		return uniqBy(networks, (network) => network.id);
	}, [profile, selectedNetworkIds]);

	const defaultWalletFilters = useMemo(
		() =>
			pick(defaultConfiguration, [
				"walletsDisplayType",
				"selectedNetworkIds",
				"showPortfolio",
				"showTransactions",
			]),
		[defaultConfiguration],
	);

	const isFilterChanged = useMemo(
		() =>
			!isEqual(defaultWalletFilters, {
				walletsDisplayType,
				selectedNetworkIds,
				showPortfolio,
				showTransactions,
			}),
		[walletsDisplayType, selectedNetworkIds, showPortfolio, showTransactions, defaultWalletFilters],
	);

	return useMemo<FilterWalletsHookProps>(
		() => ({
			networks,
			useTestNetworks: profile.settings().get(ProfileSetting.UseTestNetworks),
			walletsDisplayType,
			selectedNetworkIds,
			showPortfolio,
			showTransactions,
			isFilterChanged,
			viewType,
		}),
		[
			walletsDisplayType,
			selectedNetworkIds,
			showPortfolio,
			showTransactions,
			viewType,
			isFilterChanged,
			networks,
			profile,
		],
	);
};
