import React from "react";
import { render } from "testing-library";

import { CircularProgressBar } from "./CircularProgressBar";

describe("CircularProgressBar", () => {
	it("should render", () => {
		const { container, asFragment, getByTestId } = render(<CircularProgressBar value={50} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
		expect(getByTestId("CircularProgressBar__percentage")).toHaveTextContent("50%");
	});
});
