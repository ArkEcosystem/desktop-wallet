import React from "react";
import { render } from "test-utils";

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
});
