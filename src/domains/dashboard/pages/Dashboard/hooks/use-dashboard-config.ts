import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { uniq } from "@arkecosystem/utils";
import { DashboardConfiguration } from "domains/dashboard/pages/Dashboard";
import { useCallback, useState } from "react";

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

	const [configuration, setConfiguration] = useState(defaultConfiguration);

	const getConfiguration = useCallback(
		() => profile.settings().get(ProfileSetting.DashboardConfiguration, configuration) as DashboardConfiguration,
		[configuration],
	);

	const setValue = (values: Record<string, any>) => {
		const updatedConfiguration = {
			...getConfiguration(),
			...values,
		};
		profile.settings().set(ProfileSetting.DashboardConfiguration, updatedConfiguration);
		setConfiguration(updatedConfiguration);
	};

	const getValue = (property: string) => {
		const config = <Record<string, any>>getConfiguration();
		return config[property];
	};

	return {
		setValue,
		getValue,
		getConfiguration,
		defaultConfiguration,
	};
};
