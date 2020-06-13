import React from "react";
import { render } from "@testing-library/react";

import { NavBar } from "../";

describe("NavBar", () => {
	it("should render", () => {
		const { container, asFragment } = render(<NavBar />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
