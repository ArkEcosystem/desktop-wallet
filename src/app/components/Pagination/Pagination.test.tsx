import React from "react";
import { fireEvent, render } from "testing-library";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
	const handleSelectPage = jest.fn();

	it("should render properly", () => {
		const { asFragment } = render(
			<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle page selection properly", () => {
		const { asFragment, getByText } = render(
			<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />,
		);

		fireEvent.click(getByText("2"));

		expect(handleSelectPage).toHaveBeenCalledWith(2);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render previous buttons as disabled on last page", () => {
		const { asFragment, getByTestId } = render(
			<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />,
		);

		expect(getByTestId("Pagination__previous")).toBeDisabled();
		expect(getByTestId("Pagination__first")).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle first page click properly", () => {
		const { asFragment, getByTestId } = render(
			<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={3} />,
		);

		fireEvent.click(getByTestId("Pagination__first"));

		expect(handleSelectPage).toHaveBeenCalledWith(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle previous page click properly", () => {
		const { asFragment, getByTestId } = render(
			<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={2} />,
		);

		fireEvent.click(getByTestId("Pagination__previous"));

		expect(handleSelectPage).toHaveBeenCalledWith(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle next page click properly", () => {
		const { asFragment, getByTestId } = render(
			<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={2} />,
		);

		fireEvent.click(getByTestId("Pagination__next"));

		expect(handleSelectPage).toHaveBeenCalledWith(3);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle last page click properly", () => {
		const { asFragment, getByTestId } = render(
			<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />,
		);

		fireEvent.click(getByTestId("Pagination__last"));

		expect(handleSelectPage).toHaveBeenCalledWith(3);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render next buttons as disabled on last page", () => {
		const { asFragment, getByTestId } = render(
			<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={3} />,
		);

		expect(getByTestId("Pagination__next")).toBeDisabled();
		expect(getByTestId("Pagination__last")).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();
	});
});
