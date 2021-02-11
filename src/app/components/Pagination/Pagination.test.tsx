import React from "react";
import { fireEvent, render } from "testing-library";

import { Pagination } from "./Pagination";

const handleSelectPage = jest.fn();

describe("Pagination", () => {
	it("should render", () => {
		const { asFragment } = render(
			<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("shouldn't render", () => {
		const { asFragment, queryByTestId } = render(
			<Pagination totalCount={4} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />,
		);

		expect(queryByTestId("Pagination")).toBeNull();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render condensed", () => {
		const { asFragment } = render(
			<Pagination
				totalCount={12}
				itemsPerPage={4}
				onSelectPage={handleSelectPage}
				currentPage={1}
				variant="condensed"
			/>,
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

	it.each([
		["first", 1],
		["second", 2],
		["third", 3],
	])("should not render first button if pagination buttons include 1 (%s page)", (count, currentPage) => {
		const { asFragment, queryByTestId } = render(
			<Pagination totalCount={10} itemsPerPage={1} onSelectPage={handleSelectPage} currentPage={currentPage} />,
		);

		expect(queryByTestId("Pagination__first")).not.toBeInTheDocument();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render previous buttons on first page", () => {
		const { asFragment, queryByTestId } = render(
			<Pagination totalCount={10} itemsPerPage={1} onSelectPage={handleSelectPage} currentPage={1} />,
		);

		expect(queryByTestId("Pagination__previous")).not.toBeInTheDocument();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render next button on last page", () => {
		const { asFragment, queryByTestId } = render(
			<Pagination totalCount={10} itemsPerPage={1} onSelectPage={handleSelectPage} currentPage={10} />,
		);

		expect(queryByTestId("Pagination__next")).not.toBeInTheDocument();

		expect(asFragment()).toMatchSnapshot();
	});

	it.each([
		["last", 10],
		["second-to-last", 9],
		["third-to-last", 8],
	])("should not render first button if pagination buttons include the last page (%s page)", (count, currentPage) => {
		const { asFragment, queryByTestId } = render(
			<Pagination totalCount={10} itemsPerPage={1} onSelectPage={handleSelectPage} currentPage={currentPage} />,
		);

		expect(queryByTestId("Pagination__last")).not.toBeInTheDocument();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle first page click properly", () => {
		const { asFragment, getByTestId } = render(
			<Pagination totalCount={150} itemsPerPage={1} onSelectPage={handleSelectPage} currentPage={101} />,
		);

		fireEvent.click(getByTestId("Pagination__first"));

		expect(handleSelectPage).toHaveBeenCalledWith(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle previous page click properly", () => {
		const { asFragment, getByTestId } = render(
			<Pagination totalCount={40} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={9} />,
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
			<Pagination totalCount={30} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />,
		);

		fireEvent.click(getByTestId("Pagination__last"));

		expect(handleSelectPage).toHaveBeenCalledWith(3);
		expect(asFragment()).toMatchSnapshot();
	});
});
