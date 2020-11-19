export type ToggleAllOptionProps = {
	onClick?: any;
	isHidden?: boolean;
	isSelected?: boolean;
};

export type Network = {
	id?: string;
	name: string;
	isSelected: boolean;
	coin: string;
	onClick?: any;
	isLive?: boolean;
};

export type FilterNetworkProps = {
	title?: string;
	networks?: Network[];
	onChange?: (network: Network, networks: Network[]) => void;
	onViewAll?: any;
	hideViewAll?: boolean;
	className?: string;
	useTestNetworks?: boolean;
};
