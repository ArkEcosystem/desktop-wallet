import React from "react";
import { render } from "testing-library";

import { StepIndicator } from "./StepIndicator";

describe("StepIndicator", () => {
	it("should render", () => {
		const { container, asFragment } = render(<StepIndicator />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
