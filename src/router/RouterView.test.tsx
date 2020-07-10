/* eslint-disable react/display-name */
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "testing-library";

import { RouterView } from "./RouterView";

describe("RouterView", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(
			<MemoryRouter>
				<RouterView routes={[{ path: "/", component: () => <h1>Test</h1> }]} />
			</MemoryRouter>,
		);
		expect(getByTestId("RouterView__wrapper")).toHaveTextContent("Test");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom wrapper", () => {
		const { getByTestId, asFragment } = render(
			<MemoryRouter>
				<RouterView wrapper="section" routes={[{ path: "/", component: () => <h1>Test</h1> }]} />
			</MemoryRouter>,
		);
		expect(getByTestId("RouterView__wrapper").tagName).toEqual("SECTION");
		expect(asFragment()).toMatchSnapshot();
	});
});
