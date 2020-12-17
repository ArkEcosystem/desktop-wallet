export type DashboardConfiguration = {
	showTransactions: boolean;
	viewType: "list" | "grid";
	walletsDisplayType: "all" | "favorites" | "ledger";
	selectedNetworkIds: string[];
};
