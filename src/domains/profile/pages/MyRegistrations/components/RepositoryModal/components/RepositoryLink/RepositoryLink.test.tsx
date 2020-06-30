import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter as Router } from "react-router-dom";

import { RepositoryLink } from "./RepositoryLink";

describe("RepositoryLink", () => {
	it("should render properly", () => {
		const { container, asFragment, getByText } = render(
			<Router>
				<I18nextProvider i18n={i18n}>
					<RepositoryLink provider="GitLab" url="http://github.com/robank" />,
				</I18nextProvider>
			</Router>,
		);

		expect(asFragment()).toMatchSnapshot();
		expect(container.querySelector("svg")).toHaveTextContent("gitlab.svg");
		expect(getByText("GitLab")).toBeTruthy();
		expect(getByText("http://github.com/robank")).toBeTruthy();
	});
});
