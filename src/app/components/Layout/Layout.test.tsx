import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { render } from "testing-library";
import { renderWithRouter } from "utils/testing-library";

import { Layout } from "./Layout";

describe("Layout", () => {
	it("should render", () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId">
				<Layout>
					<h1>Test</h1>
				</Layout>
			</Route>,
			{
				routes: ["/profiles/1"],
			},
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should hide the navigation bar", () => {
		const { asFragment } = render(
			<MemoryRouter>
				<Layout>
					<h1>Test</h1>
				</Layout>
			</MemoryRouter>,
		);
		expect(asFragment()).toMatchSnapshot();
	});
});
