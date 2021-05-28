export interface PaginationProps {
	totalCount: number;
	itemsPerPage: number;
	onSelectPage: any;
	currentPage: number;
	className?: string;
	variant?: "condensed";
}

export interface PaginationSearchProps {
	children?: React.ReactNode;
	onSelectPage: (page: number) => void;
	totalPages?: number;
}

export interface PaginationSearchFormProps {
	onClose: () => void;
	totalPages?: number;
	onSelectPage: (page: number) => void;
}
