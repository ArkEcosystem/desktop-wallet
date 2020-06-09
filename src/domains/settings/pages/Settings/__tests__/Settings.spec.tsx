import React from "react";
import { render } from "@testing-library/react";

import { Settings } from "../";

describe("Settings", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Settings />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
