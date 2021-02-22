import React from "react";
import { render } from "utils/testing-library";

import { Section } from "./Section";

describe("Section", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Section />);
		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
