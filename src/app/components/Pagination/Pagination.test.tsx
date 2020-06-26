import { fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
	const handleSelectPage = jest.fn();

	it("should render properly", () => {
		const { asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />
			</I18nextProvider>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle page selection properly", () => {
		const { asFragment, getByText } = render(
			<I18nextProvider i18n={i18n}>
				<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />
			</I18nextProvider>,
		);

		fireEvent.click(getByText("2"));

		expect(handleSelectPage).toHaveBeenCalledWith(2);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render previous buttons as disabled on last page", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />
			</I18nextProvider>,
		);

		expect(getByTestId("Pagination__previous")).toBeDisabled();
		expect(getByTestId("Pagination__first")).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle first page click properly", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={3} />
			</I18nextProvider>,
		);

		fireEvent.click(getByTestId("Pagination__first"));

		expect(handleSelectPage).toHaveBeenCalledWith(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle previous page click properly", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={2} />
			</I18nextProvider>,
		);

		fireEvent.click(getByTestId("Pagination__previous"));

		expect(handleSelectPage).toHaveBeenCalledWith(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle next page click properly", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={2} />
			</I18nextProvider>,
		);

		fireEvent.click(getByTestId("Pagination__next"));

		expect(handleSelectPage).toHaveBeenCalledWith(3);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle last page click properly", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />
			</I18nextProvider>,
		);

		fireEvent.click(getByTestId("Pagination__last"));

		expect(handleSelectPage).toHaveBeenCalledWith(3);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render next buttons as disabled on last page", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={3} />
			</I18nextProvider>,
		);

		expect(getByTestId("Pagination__next")).toBeDisabled();
		expect(getByTestId("Pagination__last")).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();
	});
});
