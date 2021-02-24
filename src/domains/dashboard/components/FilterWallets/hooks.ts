import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { uniqBy } from "@arkecosystem/utils";
import { useDashboardConfig } from "domains/dashboard/pages/Dashboard/hooks";
import { useMemo } from "react";

import { FilterWalletsHookProps } from "./";

export const useWalletFilters = ({ profile }: { profile: Profile }) => {
	const { defaultConfiguration, setValue, walletsDisplayType, selectedNetworkIds, viewType } = useDashboardConfig({
		profile,
	});

	const allWalletsLength = profile.wallets().values().length;
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
	}, [profile, selectedNetworkIds, allWalletsLength]); // eslint-disable-line react-hooks/exhaustive-deps

	const isFilterChanged = useMemo(() => {
		if (walletsDisplayType !== defaultConfiguration.walletsDisplayType) {
			return true;
		}

		if (selectedNetworkIds.length < defaultConfiguration.selectedNetworkIds.length) {
			return true;
		}

		return false;
	}, [walletsDisplayType, selectedNetworkIds, defaultConfiguration]);

	return useMemo<FilterWalletsHookProps & { update: (key: string, value: any) => void }>(
		() => ({
			networks,
			useTestNetworks: profile.settings().get(ProfileSetting.UseTestNetworks),
			walletsDisplayType,
			selectedNetworkIds,
			isFilterChanged,
			viewType,
			update: setValue,
		}),
		[walletsDisplayType, selectedNetworkIds, viewType, isFilterChanged, networks, profile, setValue],
	);
};
