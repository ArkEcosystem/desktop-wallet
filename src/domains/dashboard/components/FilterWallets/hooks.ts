import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { uniqBy } from "@arkecosystem/utils";
import { useWalletConfig } from "domains/dashboard/hooks";
import { useMemo } from "react";

import { FilterWalletsHookProperties } from ".";

export const useWalletFilters = ({ profile }: { profile: Contracts.IProfile }) => {
	const { defaultConfiguration, setValue, walletsDisplayType, selectedNetworkIds, viewType } = useWalletConfig({
		profile,
	});

	const allWalletsLength = profile.wallets().values().length;
	const networks = useMemo(() => {
		const networks = profile
			.wallets()
			.values()
			.map((wallet) => ({
				coin: wallet.network().coin(),
				id: wallet.network().id(),
				isLive: wallet.network().isLive(),
				isSelected: selectedNetworkIds.includes(wallet.network().id()),
				name: wallet.network().name(),
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

	return useMemo<FilterWalletsHookProperties>(
		() => ({
			disabled: !profile.wallets().count(),
			isFilterChanged,
			networks,
			selectedNetworkIds,
			update: setValue,
			useTestNetworks: profile.settings().get(Contracts.ProfileSetting.UseTestNetworks),
			viewType,
			walletsDisplayType,
		}),
		[walletsDisplayType, selectedNetworkIds, viewType, isFilterChanged, networks, profile, setValue],
	);
};
