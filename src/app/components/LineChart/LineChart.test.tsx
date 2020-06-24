import { render } from "@testing-library/react";
import React from "react";

import { LineChart } from "./LineChart";

describe("Formatted LineChart", () => {
	it("should render", () => {
		const { container } = render(<LineChart />);
		expect(container).toMatchSnapshot();
	});
});
