import React from "react";
import { render } from "utils/testing-library";

import { Page } from "./Page";

describe("Page", () => {
	it("should render", () => {
		const sidebar = true;

		const { container, asFragment } = render(<Page title="Test" sidebar={sidebar} />);
		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without sidebar", () => {
		const { container, asFragment } = render(<Page title="Test" />);
		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
