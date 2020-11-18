import { Profile,ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { uniq } from "@arkecosystem/utils";

export const enableNetworkInDashboardFilters = (profile: Profile, networkId: string) => {
	const config: any = profile.settings().get(ProfileSetting.DashboardConfiguration);
	config.selectedNetworkIds.push(networkId);
	profile.settings().set(ProfileSetting.DashboardConfiguration, {
		...config,
		selectedNetworkIds: uniq(config.selectedNetworkIds),
	});
};
