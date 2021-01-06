import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

import { CompactPagination } from "./components/CompactPagination";

const Wrapper = styled.div`
	${tw`flex space-x-3 h-10`}

	button:first-child,button:last-child {
		${tw``}
	}

	button {
		${tw`py-2 px-4 text-theme-primary-500`}
	}
`;

type PaginationProps = {
	totalCount: number;
	itemsPerPage: number;
	onSelectPage: any;
	currentPage: number;
	className?: string;
	variant?: "condensed";
};

const PaginationButton = styled.div`
	${tw`text-theme-primary-500 cursor-pointer px-2 text-base inline-flex items-center font-semibold text-center transition-all duration-100 ease-linear justify-center`}

	&:not(:disabled):hover {
		${tw`bg-theme-primary text-white rounded`}
		box-shadow: 2px 3px 10px 2px rgba(var(--theme-color-primary-rgb), 0.2);
		transform: scale(1.1);
	}

	&.current-page {
		${tw`bg-theme-primary-light`}
	}
`;

const PaginationSearchButton = styled.div`
	${tw`relative text-theme-primary-500 p-3 cursor-pointer flex flex-nowrap items-center`}

	&:hover {
		${tw`bg-theme-primary text-white rounded`}
		box-shadow: 2px 3px 10px 2px rgba(var(--theme-color-primary-rgb), 0.2);
		transform: scale(1.1);
	}
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

	if (variant === "condensed")
		return (
			<CompactPagination
				totalCount={totalCount}
				itemsPerPage={itemsPerPage}
				onSelectPage={onSelectPage}
				currentPage={currentPage}
			/>
		);

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

			<div className="flex px-2 rounded bg-theme-primary-contrast">
				{paginationButtons[0] !== 1 && (
					<PaginationSearchButton>
						<span>...</span>
					</PaginationSearchButton>
				)}

				{paginationButtons.map((page) => (
					<PaginationButton
						key={page}
						className={currentPage === page ? "current-page" : ""}
						onClick={() => onSelectPage(page)}
					>
						{page}
					</PaginationButton>
				))}

				{paginationButtons[paginationButtons.length - 1] !== totalPages && (
					<PaginationSearchButton>
						<span>...</span>
					</PaginationSearchButton>
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
