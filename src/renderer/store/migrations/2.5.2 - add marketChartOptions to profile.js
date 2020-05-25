import { clone } from "lodash";

import { StoreBinding } from "@/enums";

export default (store) => {
	store.getters["profile/all"].forEach((profile) => {
		if (profile.marketChartOptions === undefined) {
			const updatedProfile = clone(profile);

			updatedProfile.marketChartOptions = {
				isEnabled: profile.isMarketChartEnabled,
				isExpanded: true,
				period: "day",
			};

			delete updatedProfile.isMarketChartEnabled;

			store.dispatch(StoreBinding.ProfileUpdate, updatedProfile);
		}
	});

	// All successful migrations should update this property
	store.dispatch(StoreBinding.AppSetLatestAppliedMigration, "2.5.2");
};
