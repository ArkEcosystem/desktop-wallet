import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import { PaginationProps, PaginationSearch } from "./";
import { CompactPagination } from "./components/CompactPagination";
import { PaginationButton, PaginationWrapper } from "./Pagination.styles";

const Wrapper = styled.div`
	${PaginationWrapper}
`;

const PaginationButtonStyled = styled.div`
	${PaginationButton}
`;

export const Pagination = ({
	totalCount,
	itemsPerPage,
	onSelectPage,
	currentPage,
	className,
	variant,
}: PaginationProps) => {
	const { t } = useTranslation();

	const totalPages = Math.ceil(totalCount / itemsPerPage);

	const buttonCount = useMemo(() => (currentPage < 100 ? 7 : 5), [currentPage]);
	const subRangeLength = useMemo(() => Math.floor(buttonCount / 2), [buttonCount]);

	const paginationButtons = useMemo(() => {
		let buttons;

		if (totalPages <= buttonCount) {
			buttons = Array(...Array(totalPages)).map((_, i) => i + 1);
		} else if (currentPage <= subRangeLength + 1) {
			buttons = Array(...Array(buttonCount)).map((_, i) => i + 1);
		} else if (currentPage >= totalPages - subRangeLength) {
			buttons = Array(...Array(buttonCount)).map((_, i) => totalPages - buttonCount + i + 1);
		} else {
			buttons = Array(...Array(buttonCount)).map((_, i) => currentPage - subRangeLength + i);
		}

		return buttons;
	}, [currentPage, totalPages, buttonCount, subRangeLength]);

	const showFirst = useMemo(() => !paginationButtons.includes(1), [paginationButtons]);
	const showPrevious = useMemo(() => currentPage > 1, [currentPage]);
	const showNext = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
	const showLast = useMemo(() => totalPages !== currentPage + 1 && !paginationButtons.includes(totalPages), [
		currentPage,
		totalPages,
		paginationButtons,
	]);

	if (totalPages <= 1) {
		return null;
	}

	if (variant === "condensed") {
		return (
			<CompactPagination
				totalCount={totalCount}
				itemsPerPage={itemsPerPage}
				onSelectPage={onSelectPage}
				currentPage={currentPage}
			/>
		);
	}

	return (
		<Wrapper data-testid="Pagination" className={className}>
			{showFirst && (
				<Button
					data-testid="Pagination__first"
					variant="secondary"
					onClick={() => onSelectPage((currentPage = 1))}
				>
					<Icon name="PaginationFirst" height={12} width={12} />
				</Button>
			)}

			{showPrevious && (
				<Button
					data-testid="Pagination__previous"
					variant="secondary"
					onClick={() => onSelectPage((currentPage -= 1))}
				>
					<Icon name="Back" className="mr-2" height={10} width={10} />
					{t("COMMON.PREVIOUS")}
				</Button>
			)}

			<div className="flex relative px-2 rounded bg-theme-primary-100 dark:bg-theme-secondary-800">
				{paginationButtons[0] !== 1 && (
					<PaginationSearch onSelectPage={onSelectPage} totalPages={totalPages}>
						<span>...</span>
					</PaginationSearch>
				)}

				{paginationButtons.map((page) => (
					<PaginationButtonStyled
						key={page}
						className={currentPage === page ? "current-page" : ""}
						onClick={() => onSelectPage(page)}
					>
						{page}
					</PaginationButtonStyled>
				))}

				{paginationButtons[paginationButtons.length - 1] !== totalPages && (
					<PaginationSearch onSelectPage={onSelectPage} totalPages={totalPages}>
						<span>...</span>
					</PaginationSearch>
				)}
			</div>

			{showNext && (
				<Button
					data-testid="Pagination__next"
					variant="secondary"
					onClick={() => onSelectPage((currentPage += 1))}
				>
					{t("COMMON.NEXT")}
					<Icon name="Forward" className="ml-2" height={12} width={12} />
				</Button>
			)}

			{showLast && (
				<Button
					data-testid="Pagination__last"
					variant="secondary"
					onClick={() => onSelectPage((currentPage = totalPages))}
				>
					<Icon name="PaginationLast" height={12} width={12} />
				</Button>
			)}
		</Wrapper>
	);
};

Pagination.defaultProps = {
	currentPage: 1,
	itemsPerPage: 4,
};
