import React from "react";
import { fireEvent, render } from "testing-library";
import { act } from "utils/testing-library";

import { Toggle } from "./Toggle";

describe("Toggle", () => {
	it("should render", () => {
		const { container, asFragment, getByRole } = render(<Toggle />);

		expect(container).toBeTruthy();
		expect(getByRole("checkbox")).not.toHaveAttribute("checked", "");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render disabled", () => {
		const { container, asFragment, getByRole } = render(<Toggle disabled />);

		expect(container).toBeTruthy();
		expect(getByRole("checkbox")).toBeDisabled();
		expect(getByRole("checkbox")).not.toHaveAttribute("checked", "");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render small", () => {
		const { container, asFragment, getByRole } = render(<Toggle small />);

		expect(container).toBeTruthy();
		expect(getByRole("checkbox")).not.toHaveAttribute("checked", "");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render always on", () => {
		const { container, asFragment, getByRole } = render(<Toggle alwaysOn />);

		expect(container).toBeTruthy();
		expect(getByRole("checkbox")).not.toHaveAttribute("checked", "");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle checked", () => {
		const { asFragment, getByRole } = render(<Toggle />);
		const toggle = getByRole("checkbox");

		act(() => {
			fireEvent.change(toggle, { target: { checked: true } });
		});

		expect(toggle.checked).toEqual(true);
		expect(asFragment()).toMatchSnapshot();
	});
});
