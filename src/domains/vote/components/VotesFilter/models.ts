export type FilterOption = "all" | "current";

export interface FilterProps {
	onChange?: (selected: FilterOption) => void;
	selectedOption?: FilterOption;
	totalCurrentVotes: number;
}
