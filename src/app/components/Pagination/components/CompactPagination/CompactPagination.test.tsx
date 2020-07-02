import React from "react";
import { fireEvent, render } from "testing-library";

import { CompactPagination } from "./CompactPagination";

describe("CompactPagination", () => {
	const handleSelectPage = jest.fn();

	it("should render properly", () => {
		const { asFragment } = render(
			<CompactPagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render previous buttons as disabled on last page", () => {
		const { asFragment, getByTestId } = render(
			<CompactPagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={1} />,
		);

		expect(getByTestId("CompactPagination__previous")).toBeDisabled();
		expect(getByTestId("CompactPagination__first")).toBeDisabled();
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

	it("should render next buttons as disabled on last page", () => {
		const { asFragment, getByTestId } = render(
			<CompactPagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={3} />,
		);

		expect(getByTestId("CompactPagination__next")).toBeDisabled();
		expect(getByTestId("CompactPagination__last")).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();
	});
});
