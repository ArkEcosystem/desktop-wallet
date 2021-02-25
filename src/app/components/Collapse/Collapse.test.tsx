import React from "react";
import { render } from "testing-library";

import { Collapse } from "./Collapse";

describe("Collapse", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<Collapse>Test</Collapse>);
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
		expect(getByTestId("Collapse")).toHaveTextContent("Test");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render visible", () => {
		const { getByTestId, asFragment } = render(<Collapse isOpen>Test</Collapse>);
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "false");
		expect(getByTestId("Collapse")).toHaveTextContent("Test");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom scroll", () => {
		const { getByTestId, asFragment } = render(<Collapse className="custom-scroll">Test</Collapse>);
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
		expect(getByTestId("Collapse")).toHaveTextContent("Test");
		expect(asFragment()).toMatchSnapshot();
	});
});
