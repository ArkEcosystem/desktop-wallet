import React from "react";
import { render } from "utils/testing-library";

import { Input } from "./Input";

describe("Input", () => {
	it("should render a default input", () => {
		const { asFragment } = render(<Input />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as custom element", () => {
		const { asFragment, getByTestId } = render(<Input as="select" />);
		const input = getByTestId("Input");
		expect(input.tagName).toEqual("SELECT");

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with focus", () => {
		const { asFragment, getByTestId } = render(<Input isFocused />);
		const input = getByTestId("Input");

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with invalid", () => {
		const { asFragment, getByTestId } = render(<Input isInvalid={true} errorMessage="Field invalid" />);
		const input = getByTestId("Input__error");
		expect(input).toBeVisible();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with addons", () => {
		const { asFragment, getByText } = render(
			<Input addons={{ start: <span>start</span>, end: <span>end</span> }} />,
		);

		expect(getByText("start")).toBeTruthy();
		expect(getByText("end")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with suggestion", () => {
		const { asFragment, getByTestId } = render(<Input suggestion="suggestion" />);

		expect(getByTestId("Input__suggestion")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});
});
