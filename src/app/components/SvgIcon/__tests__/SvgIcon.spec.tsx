import React from "react";
import { render } from "@testing-library/react";

import { SvgIcon } from "../";

describe("SvgIcon", () => {
	it("should render", () => {
		const { container, asFragment } = render(<SvgIcon name="ark" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
