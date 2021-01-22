export type PaginationProps = {
	totalCount: number;
	itemsPerPage: number;
	onSelectPage: any;
	currentPage: number;
	className?: string;
	variant?: "condensed";
};

export type PaginationSearchProps = {
	children?: React.ReactNode;
	onSelectPage: (page: number) => void;
	totalPages?: number;
};

export type PaginationSearchFormProps = {
	onClose: () => void;
	totalPages?: number;
	onSelectPage: (page: number) => void;
};
