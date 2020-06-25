import { Button } from "app/components/Button";
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
	button:not(:first-child) {
		margin-left: -0.5rem;
	}

	button:last-child {
		margin-left: 1rem;
	}
`;

type PaginationProps = {
	totalCount: number;
	itemsPerPage: number;
	onSelectPage: any;
	currentPage: number;
};

export const Pagination = ({ totalCount, itemsPerPage, onSelectPage, currentPage }: PaginationProps) => {
	const totalPages = Math.ceil(totalCount / itemsPerPage);
	const pageButtons = Array.from(Array(totalPages), (_, i) => i + 1);

	return (
		<Wrapper>
			{pageButtons.map((page) => (
				<Button key={page} variant="plain" onClick={() => onSelectPage(page)}>
					{page}
				</Button>
			))}
			<Button
				variant="plain"
				onClick={() => onSelectPage((currentPage += 1))}
				disabled={currentPage === pageButtons.length}
			>
				Next
			</Button>
		</Wrapper>
	);
};

Pagination.defaultProps = {
	currentPage: 1,
	itemsPerPage: 4,
};
