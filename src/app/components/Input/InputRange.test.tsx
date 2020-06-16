import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { InputRange } from "./InputRange";

describe("InputRange", () => {
	it("should render with default value", () => {
		const { asFragment, getByTestId } = render(<InputRange defaultValue={5} min={1} max={10} step={1} />);
		expect(getByTestId("Input")).toHaveValue("5");
		expect(getByTestId("Range__thumb")).toHaveAttribute("aria-valuenow", "5");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should update the range when changing the input", () => {
		const { getByTestId } = render(<InputRange defaultValue={5} min={1} max={10} step={1} />);
		const input = getByTestId("Input");
		fireEvent.change(input, { target: { value: "9" } });
		expect(getByTestId("Range__thumb")).toHaveAttribute("aria-valuenow", "9");
	});

	it("should update the input when changing the range", () => {
		const { getByTestId } = render(<InputRange defaultValue={5} min={1} max={10} step={1} />);
		const thumb = getByTestId("Range__thumb");
		fireEvent.keyDown(thumb, { key: "ArrowRight", code: "ArrowRight" });
		expect(getByTestId("Range__thumb")).toHaveAttribute("aria-valuenow", "6");
		expect(getByTestId("Input")).toHaveValue("6");
	});
});
