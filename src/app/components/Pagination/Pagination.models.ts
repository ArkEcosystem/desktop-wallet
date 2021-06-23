export interface PaginationProperties {
	totalCount: number;
	itemsPerPage?: number;
	onSelectPage: any;
	currentPage: number;
	className?: string;
}

export interface PaginationSearchProperties {
	children?: React.ReactNode;
	onClick: () => void;
	onSelectPage: (page?: number) => void;
	totalPages?: number;
	isDisabled?: boolean;
}

export interface PaginationSearchFormProperties {
	onClose: () => void;
	totalPages?: number;
	onSelectPage: (page?: number) => void;
}
