export type Option = {
	label: string;
	value: string | number;
};

export type ContactListItemProps = {
	item: any;
	options: Option[];
	variant?: "condensed";
	type?: string;
	onAction?: (action: Option, address: any) => void;
};
