export type FilterOption = "all" | "current";

export interface FilterProperties {
	onChange?: (selected: FilterOption) => void;
	selectedOption?: FilterOption;
	totalCurrentVotes: number;
}
