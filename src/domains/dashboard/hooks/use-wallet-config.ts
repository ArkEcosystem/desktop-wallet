import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { uniq } from "@arkecosystem/utils";
import { useConfiguration, useEnvironmentContext } from "app/contexts";
import { DashboardConfiguration } from "domains/dashboard/pages/Dashboard";
import { useMemo } from "react";

export const useWalletConfig = ({
	profile,
	defaults,
}: {
	profile: Contracts.IProfile;
	defaults?: DashboardConfiguration;
}) => {
	const env = useEnvironmentContext();

	const defaultConfiguration: DashboardConfiguration = {
		walletsDisplayType: "all",
		viewType: "grid",
		selectedNetworkIds: uniq(
			profile
				.wallets()
				.values()
				.map((wallet) => wallet.network().id()),
		),
		...defaults,
	};

	const { dashboard, setConfiguration } = useConfiguration();
	const profileDefaults = useMemo(
		() =>
			profile
				.settings()
				.get(Contracts.ProfileSetting.DashboardConfiguration, defaultConfiguration) as DashboardConfiguration,
		[profile, defaultConfiguration],
	);

	const dashboardConfiguration = dashboard || profileDefaults;

	const setValue = async (key: string, value: any) => {
		dashboardConfiguration[key] = value;

		setConfiguration({ dashboard: dashboardConfiguration });
		profile.settings().set(Contracts.ProfileSetting.DashboardConfiguration, dashboardConfiguration);
		await env.persist();
	};

	const { selectedNetworkIds, walletsDisplayType } = dashboardConfiguration;
	const allWalletsLength = profile.wallets().values().length;
	const selectedWallets = useMemo(
		() =>
			profile
				.wallets()
				.values()
				.filter((wallet) => {
					const usesTestNetworks = profile.settings().get(Contracts.ProfileSetting.UseTestNetworks);
					if (!usesTestNetworks && wallet.network().isTest()) {
						return false;
					}

					if (!selectedNetworkIds?.includes(wallet.network().id())) {
						return false;
					}

					if (walletsDisplayType === "starred") {
						return wallet.isStarred();
					}

					if (walletsDisplayType === "ledger") {
						return wallet.isLedger();
					}

					return true;
				}),
		[profile, dashboard, selectedNetworkIds, walletsDisplayType, allWalletsLength], // eslint-disable-line react-hooks/exhaustive-deps
	);

	return {
		setValue,
		selectedWallets,
		...dashboardConfiguration,
		defaultConfiguration,
	};
};
