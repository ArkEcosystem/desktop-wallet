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

	const profileDefaults = useMemo(() => profile
			.settings()
			.get(ProfileSetting.DashboardConfiguration, defaultConfiguration) as DashboardConfiguration, [profile]);

	const {
		configuration: { dashboard },
		setConfiguration,
	} = useConfiguration();

	const setValue = (values: Record<string, any>) => {
		const updatedConfiguration = {
			...(dashboard || profileDefaults),
			...values,
		};

		setConfiguration({ dashboard: updatedConfiguration });
		profile.settings().set(ProfileSetting.DashboardConfiguration, updatedConfiguration);
	};

	return {
		setValue,
		...(dashboard || profileDefaults),
		defaultConfiguration,
	};
};
