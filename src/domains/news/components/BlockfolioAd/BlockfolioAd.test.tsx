import React from "react";
import { render } from "testing-library";

import { BlockfolioAd } from "./BlockfolioAd";

describe("BlockfolioAd", () => {
	it("should render", () => {
		const { container, asFragment } = render(<BlockfolioAd />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
