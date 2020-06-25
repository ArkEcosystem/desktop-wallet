import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

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
};

const PaginationButton = styled.div`
	${tw`text-theme-primary-500 hover:bg-theme-primary-light cursor-pointer px-2 text-base inline-flex items-center font-semibold text-center transition-all duration-100 ease-linear justify-center`}

	&.current-page {
		${tw`bg-theme-primary-light`}
	}
`;

export const Pagination = ({ totalCount, itemsPerPage, onSelectPage, currentPage, className }: PaginationProps) => {
	const { t } = useTranslation();
	const totalPages = Math.ceil(totalCount / itemsPerPage);
	const pageButtons = Array.from(Array(totalPages), (_, i) => i + 1);

	return (
		<Wrapper className={className}>
			<Button variant="plain" onClick={() => onSelectPage((currentPage = 1))} disabled={currentPage === 1}>
				<Icon name="PaginationFirst" height={12} width={12} />
			</Button>

			<Button variant="plain" onClick={() => onSelectPage((currentPage -= 1))} disabled={currentPage === 1}>
				<Icon name="Back" className="mr-2" height={10} width={10} />
				{t("COMMON.PREVIOUS")}
			</Button>

			<div className="flex px-2 bg-theme-primary-contrast rounded">
				{pageButtons.map((page) => (
					<PaginationButton
						key={page}
						onClick={() => onSelectPage(page)}
						className={currentPage === page ? "current-page" : ""}
					>
						{page}
					</PaginationButton>
				))}
			</div>

			<Button
				variant="plain"
				onClick={() => onSelectPage((currentPage += 1))}
				disabled={currentPage === pageButtons.length}
			>
				{t("COMMON.NEXT")}
				<Icon name="Forward" className="ml-2" height={12} width={12} />
			</Button>

			<Button
				variant="plain"
				onClick={() => onSelectPage((currentPage = pageButtons.length))}
				disabled={currentPage === pageButtons.length}
			>
				<Icon name="PaginationLast" height={12} width={12} />
			</Button>
		</Wrapper>
	);
};

Pagination.defaultProps = {
	currentPage: 1,
	itemsPerPage: 4,
};
