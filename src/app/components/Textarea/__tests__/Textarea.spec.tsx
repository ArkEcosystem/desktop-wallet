import React from "react";
import { render } from "@testing-library/react";
import { TextArea } from "../TextArea";

describe("TextArea", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<TextArea />);
		const textarea = getByTestId("TextArea");
		expect(textarea.tagName).toEqual("TEXTAREA");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as invalid", () => {
		const { asFragment } = render(<TextArea isInvalid />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as disabled", () => {
		const { getByTestId, asFragment } = render(<TextArea disabled />);
		const textarea = getByTestId("TextArea");
		expect(textarea).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();
	});
});
