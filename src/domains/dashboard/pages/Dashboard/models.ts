export type DashboardProps = {
	balances?: any;
};

export type DashboardConfiguration = {
	showPortfolio: boolean;
	showTransactions: boolean;
	viewType: "list" | "grid";
	walletsDisplayType: "all" | "favorites" | "ledger";
	selectedNetworkIds: string[];
};
