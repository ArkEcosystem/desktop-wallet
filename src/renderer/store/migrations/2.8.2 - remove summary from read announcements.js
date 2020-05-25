import { StoreBinding } from "@/enums";

export default (store) => {
	const readAnnouncements = store.getters["announcements/read"];
	store.dispatch(StoreBinding.AnnouncementsMarkAsReadBulk, readAnnouncements);

	store.dispatch(StoreBinding.AppSetLatestAppliedMigration, "2.8.2");
};
