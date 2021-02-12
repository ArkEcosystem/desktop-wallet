import React from "react";
import { render } from "utils/testing-library";

import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
	it("should render default", () => {
		const { asFragment } = render(<Tooltip />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render small", () => {
		const { asFragment } = render(<Tooltip content="Test small tooltip" variant="sm" />);
		expect(asFragment()).toMatchSnapshot();
	});
});
