import React from "react";
import { render } from "@testing-library/react";

import { CreateProfile } from "../";

describe("CreateProfile", () => {
	it("should render", () => {
		const { container, asFragment } = render(<CreateProfile />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
