import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { NavHeader } from "./";

describe("NavHeader", () => {
	it("should render", () => {
		const { container, asFragment, getByTestId } = render(
			<Router>
				<NavHeader title="Go back to Portfolio" route="/portfolio" />
			</Router>,
		);

		expect(container).toBeTruthy();
		expect(getByTestId("navigation-header__title")).toHaveTextContent("Go back to Portfolio");
		expect(asFragment()).toMatchSnapshot();
	});
});
