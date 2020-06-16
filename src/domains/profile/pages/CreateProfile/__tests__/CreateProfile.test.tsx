import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { CreateProfile } from "../";

describe("CreateProfile", () => {
	it("should render", () => {
		const { container, asFragment } = render(
			<Router>
				<CreateProfile />
			</Router>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
