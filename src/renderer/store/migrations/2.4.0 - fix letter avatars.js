import { StoreBinding } from "@/enums";

// Update the schema of profile avatars to be consistent and use `null` instead
// of `null` and `undefined` when to establish a "letter" avatar.
// It also fixes profiles that have been created, incorrectly, using `extraItems`
// from `SelectionAvatar`
export default (store) => {
	store.getters["profile/all"].forEach((profile) => {
		if (profile.avatar === undefined || (profile.avatar && profile.avatar.onlyLetter)) {
			store.dispatch(StoreBinding.ProfileUpdate, {
				...profile,
				avatar: null,
			});
		}
	});

	// All successful migrations should update this property
	store.dispatch(StoreBinding.AppSetLatestAppliedMigration, "2.4.0");
};
