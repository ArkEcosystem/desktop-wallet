import React from "react";
import { render } from "utils/testing-library";

import { ControlButton } from "./ControlButton";

describe("ControlButton", () => {
	it("should render", () => {
		const { asFragment } = render(<ControlButton />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without border", () => {
		const { asFragment } = render(<ControlButton noBorder />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render disabled", () => {
		const { asFragment } = render(<ControlButton disabled />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render active", () => {
		const { asFragment } = render(<ControlButton isActive />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with dot", () => {
		const { asFragment } = render(<ControlButton isChanged />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without border and with dot", () => {
		const { asFragment } = render(<ControlButton isChanged noBorder />);
		expect(asFragment()).toMatchSnapshot();
	});
});
