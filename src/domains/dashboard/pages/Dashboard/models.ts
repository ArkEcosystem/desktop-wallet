export type DashboardConfiguration = {
	viewType: "list" | "grid";
	walletsDisplayType: "all" | "starred" | "ledger";
	selectedNetworkIds: string[];
};
