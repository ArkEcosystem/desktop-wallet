import React from "react";
import { fireEvent, render } from "testing-library";

import { CompactPagination } from "./CompactPagination";

const handleSelectPage = jest.fn();

describe("CompactPagination", () => {
	it("should render properly", () => {
		const { asFragment } = render(
			<CompactPagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render first and previous buttons on first page", () => {
		const { asFragment, queryByTestId } = render(
			<CompactPagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />,
		);

		expect(queryByTestId("CompactPagination__first")).not.toBeInTheDocument();
		expect(queryByTestId("CompactPagination__previous")).not.toBeInTheDocument();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle first page click properly", () => {
		const { asFragment, getByTestId } = render(
			<CompactPagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={3} />,
		);

		fireEvent.click(getByTestId("CompactPagination__first"));

		expect(handleSelectPage).toHaveBeenCalledWith(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle previous page click properly", () => {
		const { asFragment, getByTestId } = render(
			<CompactPagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={2} />,
		);

		fireEvent.click(getByTestId("CompactPagination__previous"));

		expect(handleSelectPage).toHaveBeenCalledWith(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle next page click properly", () => {
		const { asFragment, getByTestId } = render(
			<CompactPagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={2} />,
		);

		fireEvent.click(getByTestId("CompactPagination__next"));

		expect(handleSelectPage).toHaveBeenCalledWith(3);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle last page click properly", () => {
		const { asFragment, getByTestId } = render(
			<CompactPagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />,
		);

		fireEvent.click(getByTestId("CompactPagination__last"));

		expect(handleSelectPage).toHaveBeenCalledWith(3);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render next and last buttons on last page", () => {
		const { asFragment, queryByTestId } = render(
			<CompactPagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={3} />,
		);

		expect(queryByTestId("CompactPagination__next")).not.toBeInTheDocument();
		expect(queryByTestId("CompactPagination__last")).not.toBeInTheDocument();

		expect(asFragment()).toMatchSnapshot();
	});
});
