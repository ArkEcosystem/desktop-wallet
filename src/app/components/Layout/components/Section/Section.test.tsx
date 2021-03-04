import React from "react";
import { render } from "utils/testing-library";

import { Section } from "./Section";

describe("Section", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Section />);
		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom background color", () => {
		const { container, asFragment } = render(<Section backgroundColor="--theme-secondary-background-color" />);
		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with border", () => {
		const { container, asFragment } = render(<Section border />);
		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
