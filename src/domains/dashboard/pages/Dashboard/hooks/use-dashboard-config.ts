import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { uniq } from "@arkecosystem/utils";
import { useConfiguration } from "app/contexts";
import { DashboardConfiguration } from "domains/dashboard/pages/Dashboard";
import { useMemo } from "react";

export const useDashboardConfig = ({ profile }: { profile: Profile }) => {
	const defaultConfiguration: DashboardConfiguration = {
		showChartAnimation: true,
		showPortfolio: true,
		showTransactions: true,
		walletsDisplayType: "all",
		viewType: "grid",
		selectedNetworkIds: uniq(
			profile
				.wallets()
				.values()
				.map((wallet) => wallet.network().id()),
		),
	};

	const { dashboard, setConfiguration } = useConfiguration();
	const profileDefaults = useMemo(
		() =>
			dashboard ||
			(profile
				.settings()
				.get(ProfileSetting.DashboardConfiguration, defaultConfiguration) as DashboardConfiguration),
		[profile, defaultConfiguration],
	);

	const dashboardConfiguration = dashboard || profileDefaults;

	const setValue = (key: string, value: any) => {
		dashboardConfiguration[key] = value;

		setConfiguration({ dashboard: dashboardConfiguration });
		profile.settings().set(ProfileSetting.DashboardConfiguration, dashboardConfiguration);
	};

	return {
		setValue,
		...dashboardConfiguration,
		defaultConfiguration,
	};
};
