import React from "react";
import { render } from "testing-library";

import { Input } from "./Input";

describe("Input", () => {
	it("should render a default input", () => {
		const { asFragment } = render(<Input />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with a custom element", () => {
		const { getByTestId } = render(<Input as="select" />);
		const input = getByTestId("Input");
		expect(input.tagName).toEqual("SELECT");
	});

	it("should render with focus", () => {
		const { getByTestId } = render(<Input as="select" isFocused />);
		const input = getByTestId("Input");
		expect(input.tagName).toEqual("SELECT");
	});

	it("should render with invalid", () => {
		const { getByTestId } = render(<Input as="select" isInvalid={true} errorMessage="Field invalid" />);
		const input = getByTestId("Input-error");
		expect(input).toBeVisible();
	});
});
