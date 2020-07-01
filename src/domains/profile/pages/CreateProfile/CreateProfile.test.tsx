import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "test-utils";

import { CreateProfile } from "./CreateProfile";

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
