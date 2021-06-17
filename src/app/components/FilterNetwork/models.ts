export interface ToggleAllOptionProperties {
	onClick?: any;
	isHidden?: boolean;
	isSelected?: boolean;
}

export interface Network {
	id?: string;
	name: string;
	isSelected: boolean;
	coin: string;
	onClick?: any;
	isLive?: boolean;
}

export interface FilterNetworkProperties {
	title?: string;
	networks?: Network[];
	onChange?: (network: Network, networks: Network[]) => void;
	onViewAll?: any;
	hideViewAll?: boolean;
	className?: string;
	useTestNetworks?: boolean;
}
