import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { clickOutsideHandler } from "app/hooks";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import { PaginationSearchFormProps, PaginationSearchProps } from "./";
import { PaginationSearchToggleButton, PaginationSearchWrapper, SearchInput } from "./Pagination.styles";

const PaginationSearchWrapperStyled = styled.span`
	${PaginationSearchWrapper}
`;

export const PaginationSearchButtonStyled = styled.div`
	${PaginationSearchToggleButton}
`;

export const SearchInputStyled = styled.input`
	${SearchInput}
`;

export const PaginationSearchForm = ({ onClose, totalPages = Infinity, onSelectPage }: PaginationSearchFormProps) => {
	const { t } = useTranslation();
	const form = useForm({ mode: "onChange" });

	const { page } = form.watch();

	useEffect(() => {
		if (BigNumber.make(page).isGreaterThan(totalPages)) {
			form.setValue("page", totalPages);
		}
	}, [page, form, totalPages]);

	const handleSelectPage = () => {
		if (!page) {
			return;
		}

		const pageNumber = BigNumber.make(page);

		if (pageNumber.isGreaterThan(0)) {
			onSelectPage(pageNumber.toNumber());
		}
	};

	const ref = useRef(null);
	useEffect(() => clickOutsideHandler(ref, onClose), [ref, onClose]);

	return (
		<PaginationSearchWrapperStyled>
			<Form
				data-testid="PaginationSearchForm"
				context={form}
				onSubmit={handleSelectPage}
				name="searchForm"
				className="search-form"
				ref={ref}
			>
				<SearchInputStyled
					ref={form.register}
					type="number"
					min="1"
					max={totalPages}
					name="page"
					data-testid="PaginationSearch__input"
					placeholder={t("COMMON.PAGINATION.ENTER_NUMBER")}
				/>

				<Button
					variant="transparent"
					type="submit"
					size="sm"
					className="search-control"
					data-testid="PaginationSearch__submit"
				>
					<Icon name="Search" />
				</Button>

				<Button
					variant="transparent"
					size="sm"
					onClick={onClose}
					type="button"
					className="search-control"
					data-testid="PaginationSearch__cancel"
				>
					<Icon name="Close" />
				</Button>
			</Form>
		</PaginationSearchWrapperStyled>
	);
};

export const PaginationSearch = ({ children, onSelectPage, totalPages }: PaginationSearchProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isFormVisible, setIsFormVisible] = useState(false);

	return (
		<>
			<PaginationSearchButtonStyled
				data-testid="PaginationSearchButton"
				onMouseLeave={() => setIsHovered(false)}
				onMouseEnter={() => setIsHovered(true)}
				onClick={() => setIsFormVisible(true)}
			>
				{!isHovered && <span data-testid="PaginationSearch__toggle"> {children} </span>}

				{isHovered && (
					<span data-testid="PaginationSearch__toggle-open">
						<Icon width={13} height={13} name="Search" />
					</span>
				)}
			</PaginationSearchButtonStyled>

			{isFormVisible && (
				<PaginationSearchForm
					totalPages={totalPages}
					onClose={() => setIsFormVisible(false)}
					onSelectPage={onSelectPage}
				/>
			)}
		</>
	);
};
