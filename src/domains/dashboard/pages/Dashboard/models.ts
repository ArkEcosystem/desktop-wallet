export type DashboardConfiguration = {
	viewType: "list" | "grid";
	walletsDisplayType: "all" | "favorites" | "ledger";
	selectedNetworkIds: string[];
};
