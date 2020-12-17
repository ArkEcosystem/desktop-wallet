export type FilterWalletsHookProps = {
	networks?: any;
	viewType?: "list" | "grid";
	useTestNetworks?: boolean;
	showTransactions?: boolean;
	walletsDisplayType?: string;
	selectedNetworkIds?: string[];
	isFilterChanged?: boolean;
};

export type FilterWalletsProps = {
	showToggleViews?: boolean;
	onChange?: (key: string, value: any) => void;
} & FilterWalletsHookProps;
