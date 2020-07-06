import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "testing-library";

import { Layout } from "./Layout";

describe("Layout", () => {
	it("should render", () => {
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
