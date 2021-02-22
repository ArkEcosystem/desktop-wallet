import React from "react";
import { render } from "utils/testing-library";

import { Page } from "./Page";

describe("Page", () => {
	it("should render", () => {
		const sidebar = true;

		const crumbs = [
			{
				label: "Crumb 1",
			},
			{
				label: "Crumb 2",
			},
		];

		const { container, asFragment } = render(<Page title="Test" sidebar={sidebar} crumbs={crumbs} />);
		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without crumbs", () => {
		const { container, asFragment } = render(<Page title="Test" />);
		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
