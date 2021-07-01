import { DashboardConfiguration } from "domains/dashboard/pages/Dashboard";

interface BaseProperties {
	networks?: any;
	viewType?: "list" | "grid";
	useTestNetworks?: boolean;
	walletsDisplayType?: string;
	selectedNetworkIds?: string[];
	isFilterChanged?: boolean;
	defaultConfiguration: DashboardConfiguration;
}

export type FilterWalletsHookProperties = {
	update: (key: string, value: any) => void;
	disabled: boolean;
} & BaseProperties;

export type FilterWalletsProperties = {
	onChange?: (key: string, value: any) => void;
} & BaseProperties;
