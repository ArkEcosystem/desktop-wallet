export type FilterOption = {
	label: string;
	value: string;
	isChecked: boolean;
};

export type FilterProps = {
	onChange?: (options: FilterOption[]) => void;
	defaultOptions?: FilterOption[];
};
