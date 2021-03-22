import React from "react";
import { render } from "utils/testing-library";

import { ControlButton } from "./ControlButton";

describe("ControlButton", () => {
	it("should render", () => {
		const { asFragment } = render(<ControlButton />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render active", () => {
		const { asFragment } = render(<ControlButton isActive />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render changed with dot", () => {
		const { asFragment } = render(<ControlButton isChanged />);
		expect(asFragment()).toMatchSnapshot();
	});
});
