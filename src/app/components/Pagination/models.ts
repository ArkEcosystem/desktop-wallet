export interface PaginationProps {
	totalCount: number;
	itemsPerPage: number;
	onSelectPage: any;
	currentPage: number;
	className?: string;
}

export interface PaginationSearchProps {
	children?: React.ReactNode;
	onClick: () => void;
	onSelectPage: (page?: number) => void;
	totalPages?: number;
	isEnabled?: boolean;
}

export interface PaginationSearchFormProps {
	onClose: () => void;
	totalPages?: number;
	onSelectPage: (page?: number) => void;
}
