import React from "react";
import { renderWithRouter } from "testing-library";

import { RepositoryLink } from "./RepositoryLink";

describe("RepositoryLink", () => {
	it("should render properly", () => {
		const { container, asFragment, getByText } = renderWithRouter(
			<RepositoryLink provider="GitLab" url="http://github.com/robank" />,
		);

		expect(asFragment()).toMatchSnapshot();
		expect(container.querySelector("svg")).toHaveTextContent("gitlab.svg");
		expect(getByText("GitLab")).toBeTruthy();
		expect(getByText("http://github.com/robank")).toBeTruthy();
	});
});
