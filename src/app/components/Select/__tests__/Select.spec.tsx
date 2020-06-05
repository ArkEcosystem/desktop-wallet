import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { Select } from "../";

describe("Select", () => {
	it("should render an select input", () => {
		const { container, asFragment } = render(<Select placeholder="Select option" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render an select input with options", () => {
		const { getByTestId, getAllByTestId, asFragment } = render(
			<Select placeholder="Select option">
				<option data-testid="select-option" value={1}>
					Option 1
				</option>
				<option data-testid="select-option" value={2}>
					Option 2
				</option>
			</Select>,
		);

		fireEvent.change(getByTestId("select-input"), { target: { value: 2 } });
		const options = getAllByTestId("select-option");
		expect(options[0].selected).toBeFalsy();
		expect(options[1].selected).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});
});
