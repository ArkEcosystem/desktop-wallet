/* eslint-disable react/display-name */
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { RouterView } from "router";
import { render } from "utils/testing-library";

describe("ContactRoutes", () => {
	it("should render", () => {
		const { getAllByText, asFragment } = render(
			<MemoryRouter>
				<RouterView routes={[{ path: "/", component: () => <h1>ContactRoutes</h1> }]} />
			</MemoryRouter>,
		);
		expect(getAllByText("ContactRoutes").length).toBeGreaterThan(0);
		expect(asFragment()).toMatchSnapshot();
	});
});
