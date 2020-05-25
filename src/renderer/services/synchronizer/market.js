import { StoreBinding } from "@/enums";

export default async (synchronizer) => {
	await synchronizer.$store.dispatch(StoreBinding.MarketRefreshTicker);
};
