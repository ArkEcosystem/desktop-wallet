import React from "react";
import { fireEvent, render, waitFor } from "testing-library";

import { InputRange } from "./InputRange";

const properties = {
	defaultValue: (5 * 1e8).toFixed(0),
	min: "1",
	max: "10",
	step: 1,
};

describe("InputRange", () => {
	it("should render with default value", () => {
		const { asFragment, getByTestId } = render(<InputRange {...properties} />);

		expect(getByTestId("InputCurrency")).toHaveValue("5");
		expect(getByTestId("Range__thumb")).toHaveAttribute("aria-valuenow", "5");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update the range when changing the input", () => {
		const { getByTestId } = render(<InputRange {...properties} />);
		const input = getByTestId("InputCurrency");

		fireEvent.change(input, { target: { value: "9" } });

		expect(getByTestId("Range__thumb")).toHaveAttribute("aria-valuenow", "9");
		expect(input).toHaveValue("9");
	});

	it("should update the input when changing the range", () => {
		const { getByTestId } = render(<InputRange {...properties} />);
		const thumb = getByTestId("Range__thumb");

		fireEvent.keyDown(thumb, { key: "ArrowRight", code: "ArrowRight" });

		expect(thumb).toHaveAttribute("aria-valuenow", "6");
		waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("6"));
	});

	it("should not allow a value greater than the maximum", () => {
		const { getByTestId } = render(<InputRange {...properties} />);
		const input = getByTestId("InputCurrency");

		fireEvent.change(input, { target: { value: "11" } });

		waitFor(() => expect(input).toHaveValue("10"));
		expect(getByTestId("Range__thumb")).toHaveAttribute("aria-valuenow", "10");
	});
});
