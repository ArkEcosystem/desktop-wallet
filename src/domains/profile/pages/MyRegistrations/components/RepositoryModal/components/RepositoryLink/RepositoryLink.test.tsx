import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "test-utils";

import { RepositoryLink } from "./RepositoryLink";

describe("RepositoryLink", () => {
	it("should render properly", () => {
		const { container, asFragment, getByText } = render(
			<Router>
				<RepositoryLink provider="GitLab" url="http://github.com/robank" />,
			</Router>,
		);

		expect(asFragment()).toMatchSnapshot();
		expect(container.querySelector("svg")).toHaveTextContent("gitlab.svg");
		expect(getByText("GitLab")).toBeTruthy();
		expect(getByText("http://github.com/robank")).toBeTruthy();
	});
});
