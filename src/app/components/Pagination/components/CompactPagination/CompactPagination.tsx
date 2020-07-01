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

	return (
		<Wrapper data-testid="Pagination" className={className}>
			<Button
				data-testid="CompactPagination__first"
				variant="plain"
				onClick={() => onSelectPage((currentPage = 1))}
				disabled={currentPage === 1}
			>
				<Icon name="PaginationFirst" height={12} width={12} />
			</Button>

			<Button
				data-testid="CompactPagination__previous"
				variant="plain"
				onClick={() => onSelectPage((currentPage -= 1))}
				disabled={currentPage === 1}
			>
				<Icon name="Back" height={10} width={10} />
			</Button>

			<div className="flex items-center px-4 py-2 rounded bg-theme-primary-contrast text-theme-primary">
				{`${t("COMMON.PAGE")} ${currentPage} ${t("COMMON.OF")} ${totalPages}`}
			</div>

			<Button
				data-testid="CompactPagination__next"
				variant="plain"
				onClick={() => onSelectPage((currentPage += 1))}
				disabled={currentPage === totalPages}
			>
				<Icon name="Forward" height={12} width={12} />
			</Button>

			<Button
				data-testid="CompactPagination__last"
				variant="plain"
				onClick={() => onSelectPage((currentPage = totalPages))}
				disabled={currentPage === totalPages}
			>
				<Icon name="PaginationLast" height={12} width={12} />
			</Button>
		</Wrapper>
	);
};
