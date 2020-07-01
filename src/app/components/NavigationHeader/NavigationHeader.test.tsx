import React from "react";
import { HashRouter } from "react-router-dom";
import { render } from "test-utils";

import { NavigationHeader } from "./NavigationHeader";

describe("NavigationHeader", () => {
	it("should render", () => {
		const { container, asFragment, getByTestId } = render(
			<HashRouter>
				<NavigationHeader title="Go back to Portfolio" route="/portfolio" />
			</HashRouter>,
		);

		expect(container).toBeTruthy();
		expect(getByTestId("navigation-header__title")).toHaveTextContent("Go back to Portfolio");
		expect(asFragment()).toMatchSnapshot();
	});
});
