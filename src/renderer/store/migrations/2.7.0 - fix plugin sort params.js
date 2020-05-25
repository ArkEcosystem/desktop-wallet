import { StoreBinding } from "@/enums";

export default (store) => {
	store.getters["profile/all"].forEach((profile) => {
		const invalidFields = ["id", "name", "description", "permissions", "isEnabled"];

		if (profile.pluginSortParams && invalidFields.includes(profile.pluginSortParams.field)) {
			store.dispatch(StoreBinding.ProfileUpdate, {
				...profile,
				pluginSortParams: {
					field: "title",
					type: profile.pluginSortParams.type,
				},
			});
		}
	});

	store.dispatch(StoreBinding.AppSetLatestAppliedMigration, "2.7.0");
};
