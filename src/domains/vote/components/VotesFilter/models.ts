export type FilterOption = "all" | "current";

export type FilterProps = {
	onChange?: (selected: FilterOption) => void;
	selectedOption?: FilterOption;
	totalCurrentVotes: number;
};
