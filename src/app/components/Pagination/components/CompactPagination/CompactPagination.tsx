import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

const Wrapper = styled.div`
	${tw`flex space-x-3 h-10`}

	button:first-child,button:last-child {
		${tw``}
	}

	button {
		${tw`py-2 px-2 text-theme-primary-500`}
	}
`;

type CompactPaginationProps = {
	totalCount: number;
	itemsPerPage: number;
	onSelectPage: any;
	currentPage: number;
	className?: string;
};

export const CompactPagination = ({
	totalCount,
	itemsPerPage,
	onSelectPage,
	currentPage,
	className,
}: CompactPaginationProps) => {
	const { t } = useTranslation();

	const totalPages = Math.ceil(totalCount / itemsPerPage);

	const showFirst = useMemo(() => currentPage > 2, [currentPage]);
	const showPrevious = useMemo(() => currentPage > 1, [currentPage]);
	const showNext = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
	const showLast = useMemo(() => totalPages !== currentPage, [currentPage, totalPages]);

	return (
		<Wrapper data-testid="Pagination" className={className}>
			{showFirst && (
				<Button
					data-testid="CompactPagination__first"
					variant="secondary"
					className="w-8"
					onClick={() => onSelectPage((currentPage = 1))}
				>
					<Icon name="PaginationFirst" height={12} width={12} />
				</Button>
			)}

			{showPrevious && (
				<Button
					data-testid="CompactPagination__previous"
					variant="secondary"
					className="w-8"
					onClick={() => onSelectPage((currentPage -= 1))}
				>
					<Icon name="Back" height={10} width={10} />
				</Button>
			)}

			<div className="flex items-center py-3 px-5 rounded bg-theme-primary-100 text-theme-primary-600">
				{`${t("COMMON.PAGE")} ${currentPage} ${t("COMMON.OF")} ${totalPages}`}
			</div>

			{showNext && (
				<Button
					data-testid="CompactPagination__next"
					variant="secondary"
					className="w-8"
					onClick={() => onSelectPage((currentPage += 1))}
				>
					<Icon name="Forward" height={12} width={12} />
				</Button>
			)}

			{showLast && (
				<Button
					data-testid="CompactPagination__last"
					variant="secondary"
					className="w-8"
					onClick={() => onSelectPage((currentPage = totalPages))}
				>
					<Icon name="PaginationLast" height={12} width={12} />
				</Button>
			)}
		</Wrapper>
	);
};
