import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { uniqBy } from "@arkecosystem/utils";
import { useWalletConfig } from "domains/dashboard/hooks";
import { useMemo } from "react";

import { FilterWalletsHookProps } from "./";

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

	return useMemo<FilterWalletsHookProps>(
		() => ({
			networks,
			useTestNetworks: profile.settings().get(Contracts.ProfileSetting.UseTestNetworks),
			walletsDisplayType,
			selectedNetworkIds,
			isFilterChanged,
			viewType,
			update: setValue,
			disabled: !profile.wallets().count(),
		}),
		[walletsDisplayType, selectedNetworkIds, viewType, isFilterChanged, networks, profile, setValue],
	);
};
