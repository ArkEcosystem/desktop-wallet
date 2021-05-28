interface BaseProps {
	networks?: any;
	viewType?: "list" | "grid";
	useTestNetworks?: boolean;
	walletsDisplayType?: string;
	selectedNetworkIds?: string[];
	isFilterChanged?: boolean;
}

export type FilterWalletsHookProps = {
	update: (key: string, value: any) => void;
	disabled: boolean;
} & BaseProps;

export type FilterWalletsProps = {
	onChange?: (key: string, value: any) => void;
} & BaseProps;
