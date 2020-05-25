import { TRANSACTION_GROUPS } from "@config";
import { clone } from "lodash";

import { StoreBinding } from "@/enums";

export default (store) => {
	store.getters["profile/all"].forEach((profile) => {
		const lastFees = profile.lastFees;

		const values = Object.values(lastFees || {});
		if (!values.length || values.every((value) => typeof value === "object")) {
			return;
		}

		const updatedProfile = clone(profile);

		updatedProfile.lastFees = {
			[TRANSACTION_GROUPS.STANDARD]: {
				...lastFees,
			},
		};

		store.dispatch(StoreBinding.ProfileUpdate, updatedProfile);
	});

	store.dispatch(StoreBinding.AppSetLatestAppliedMigration, "2.9.0");
};
