import { StoreBinding } from "@/enums";

export default (store) => {
	// All successful migrations should update this property
	store.dispatch(StoreBinding.AppSetLatestAppliedMigration, "2.2.0");
};
