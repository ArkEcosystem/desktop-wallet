import React from "react";
import { render } from "utils/testing-library";

import { Section } from "./Section";

describe("Section", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Section />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom background class name", () => {
		const { container, asFragment } = render(<Section backgroundClassName="bg-theme-secondary-background" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with border", () => {
		const { container, asFragment } = render(<Section border />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
