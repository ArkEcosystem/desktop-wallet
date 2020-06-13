import React from "react";
import { fireEvent, render } from "@testing-library/react";

import { Toggle } from "../";

describe("Toggle", () => {
	it("should render", () => {
		const { container, asFragment, getByRole } = render(<Toggle />);

		expect(container).toBeTruthy();
		expect(getByRole("checkbox")).not.toHaveAttribute("checked", "");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle checked", () => {
		const { asFragment, getByRole } = render(<Toggle />);
		const toggle = getByRole("checkbox");

		fireEvent.change(toggle, { target: { checked: true } });

		expect(toggle.checked).toEqual(true);
		expect(asFragment()).toMatchSnapshot();
	});
});
