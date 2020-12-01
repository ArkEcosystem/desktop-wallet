import React from "react";
import { render } from "testing-library";

import { PortfolioChart } from "./PortfolioChart";

describe("PortfolioChart", () => {
	it("should render", () => {
		const { container } = render(<PortfolioChart />);
		expect(container).toMatchSnapshot();
	});
});
