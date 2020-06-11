import React from "react";
import { render } from "@testing-library/react";

import { CircleProgressBar } from "../CircleProgressBar";

describe("CircleProgressBar", () => {
	it("should render", () => {
		const { container, asFragment } = render(<CircleProgressBar />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
