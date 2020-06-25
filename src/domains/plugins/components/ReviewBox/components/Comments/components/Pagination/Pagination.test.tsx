import { fireEvent, render } from "@testing-library/react";
import React from "react";

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

	it("should handle next page click properly", () => {
		const { asFragment, getByText } = render(
			<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={2} />,
		);

		fireEvent.click(getByText("Next"));

		expect(handleSelectPage).toHaveBeenCalledWith(3);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render next as disable on last page", () => {
		const { asFragment, getByText } = render(
			<Pagination totalCount={12} itemsPerPage={4} onSelectPage={handleSelectPage} currentPage={3} />,
		);

		expect(getByText("Next")).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();
	});
});
