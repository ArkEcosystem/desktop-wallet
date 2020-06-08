import React from "react";
import { render } from "@testing-library/react";
import { Textarea } from "../Textarea";

describe("Textarea", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<Textarea />);
		const textarea = getByTestId("Textarea");
		expect(textarea.tagName).toEqual("TEXTAREA");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as invalid", () => {
		const { asFragment } = render(<Textarea isInvalid />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as disabled", () => {
		const { getByTestId, asFragment } = render(<Textarea disabled />);
		const textarea = getByTestId("Textarea");
		expect(textarea).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();
	});
});
