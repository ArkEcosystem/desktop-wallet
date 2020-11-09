import React from "react";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

import { FilterOption, VotesFilter } from "./";

describe("VotesFilter", () => {
	it("should render empty", () => {
		const defaultOptions: FilterOption[] = [];
		const { asFragment, getByTestId } = render(<VotesFilter defaultOptions={defaultOptions} />);

		expect(() => getByTestId("dropdown__toggle")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render empty with undefined defaultOptions", () => {
		const { asFragment, getByTestId } = render(<VotesFilter />);

		expect(() => getByTestId("dropdown__toggle")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with default options", () => {
		const defaultOptions = [
			{
				label: "All",
				value: "all",
				isChecked: false,
			},
			{
				label: "Current Votes",
				value: "current",
				isChecked: true,
			},
		];
		const { asFragment } = render(<VotesFilter defaultOptions={defaultOptions} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit onChange", async () => {
		const onChange = jest.fn();
		const defaultOptions = [
			{
				label: "All",
				value: "all",
				isChecked: false,
			},
			{
				label: "Current Votes",
				value: "current",
				isChecked: true,
			},
		];

		const { getByTestId } = render(<VotesFilter defaultOptions={defaultOptions} onChange={onChange} />);

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		await waitFor(() => expect(getByTestId("dropdown__content")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("VotesFilter__option--0"));
		});

		await waitFor(() =>
			expect(onChange).toHaveBeenCalledWith([
				{ isChecked: true, label: "All", value: "all" },
				{ isChecked: false, label: "Current Votes", value: "current" },
			]),
		);
	});
});
