import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { clickOutsideHandler } from "app/hooks";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import { PaginationSearchFormProperties, PaginationSearchProperties } from ".";
import { PaginationSearchToggleButton, PaginationSearchWrapper, SearchInput } from "./Pagination.styles";

const PaginationSearchWrapperStyled = styled.span`
	${PaginationSearchWrapper}
`;

export const PaginationSearchButtonStyled = styled.button`
	${PaginationSearchToggleButton}
`;

export const SearchInputStyled = styled.input`
	${SearchInput}
`;

export const PaginationSearchForm = ({
	onClose,
	totalPages = Number.POSITIVE_INFINITY,
	onSelectPage,
}: PaginationSearchFormProperties) => {
	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { register, watch } = form;

	const { page } = watch();

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

	const reference = useRef(null);
	useEffect(() => clickOutsideHandler(reference, onClose), [reference, onClose]);

	return (
		<PaginationSearchWrapperStyled>
			<Form
				data-testid="PaginationSearchForm"
				context={form}
				onSubmit={handleSelectPage}
				name="searchForm"
				className="search-form"
				ref={reference}
			>
				<SearchInputStyled
					ref={register}
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

export const PaginationSearch = ({
	children,
	onClick,
	onSelectPage,
	totalPages,
	isDisabled,
}: PaginationSearchProperties) => {
	const [isFormVisible, setIsFormVisible] = useState(false);

	return (
		<>
			<PaginationSearchButtonStyled
				data-testid="PaginationSearchButton"
				className="group"
				type="button"
				disabled={isDisabled}
				onClick={(event) => {
					onClick();
					setIsFormVisible(true);
					(event.currentTarget as HTMLButtonElement).blur();
				}}
			>
				<span className="group-hover:invisible">{children}</span>

				<span
					data-testid="PaginationSearchButton__search"
					className="flex absolute top-0 right-0 bottom-0 left-0 invisible justify-center items-center group-hover:visible"
				>
					<Icon width={13} height={13} name="Search" />
				</span>
			</PaginationSearchButtonStyled>

			{isFormVisible && (
				<PaginationSearchForm
					totalPages={totalPages}
					onClose={() => {
						onSelectPage(undefined);
						setIsFormVisible(false);
					}}
					onSelectPage={onSelectPage}
				/>
			)}
		</>
	);
};
