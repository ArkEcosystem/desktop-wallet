import React from "react";
import { render } from "utils/testing-library";

import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
	it("should render", () => {
		const { asFragment } = render(<Tooltip content="tooltip" />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with theme", () => {
		const { asFragment } = render(<Tooltip content="tooltip" theme="dark" />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render small", () => {
		const { asFragment } = render(<Tooltip content="small tooltip" size="sm" />);

		expect(asFragment()).toMatchSnapshot();
	});
});
