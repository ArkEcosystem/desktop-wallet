import React from "react";
import { render } from "utils/testing-library";

import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<Tooltip />);
		expect(asFragment()).toMatchSnapshot();
	});
});
