import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";

import { FilterTransactions } from "./";

describe("FilterTransactions", () => {
	it("should render", () => {
		const { container, getByTestId } = render(<FilterTransactions />);
		expect(getByTestId("FilterTransactionsToggle")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it("should render with default selected option", () => {
		const { container, getByTestId } = render(
			<FilterTransactions defaultSelected={{ label: "All", value: "all" }} />,
		);
		expect(getByTestId("FilterTransactionsToggle")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it("should open dropdown list with all transaction types", async () => {
		const { container, getByTestId } = render(<FilterTransactions />);
		expect(getByTestId("FilterTransactionsToggle")).toBeInTheDocument();
		act(() => {
			fireEvent.click(getByTestId("FilterTransactionsToggle"));
		});

		await waitFor(() => expect(getByTestId("dropdown__option--core-0")).toBeInTheDocument());
		expect(container).toMatchSnapshot();
	});

	it("should emit onChange", async () => {
		const onSelect = jest.fn();

		const { getByTestId } = render(<FilterTransactions onSelect={onSelect} />);
		expect(getByTestId("FilterTransactionsToggle")).toBeInTheDocument();

		act(() => {
			fireEvent.click(getByTestId("FilterTransactionsToggle"));
		});

		await waitFor(() => expect(getByTestId("dropdown__option--core-0")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--core-0"));
		});

		expect(onSelect).toHaveBeenCalled();
	});
});
