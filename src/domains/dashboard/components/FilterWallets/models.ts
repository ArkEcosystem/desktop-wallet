export type FilterWalletsHookProps = {
	networks?: any;
	viewType?: "list" | "grid";
	useTestNetworks?: boolean;
	walletsDisplayType?: string;
	selectedNetworkIds?: string[];
	isFilterChanged?: boolean;
};

export type FilterWalletsProps = {
	onChange?: (key: string, value: any) => void;
} & FilterWalletsHookProps;
