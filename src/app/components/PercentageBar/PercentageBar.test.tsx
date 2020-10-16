import React from "react";
import { render } from "testing-library";

import { PercentageBar } from "./PercentageBar";

const data = [
	{
		color: "danger-500",
		label: "ARK",
		percentage: 40,
	},
	{
		color: "warning-500",
		label: "BTC",
		percentage: 25,
	},
	{
		color: "primary-500",
		label: "ETH",
		percentage: 20,
	},
	{
		color: "neutral-400",
		label: "Other",
		percentage: 15,
	},
];

describe("PercentageBar", () => {
	it("should render", () => {
		const { container } = render(<PercentageBar />);
		expect(container).toMatchSnapshot();
	});

	it("should render with title", () => {
		const { container } = render(<PercentageBar title="Total portfolio" />);
		expect(container).toMatchSnapshot();
	});

	it("should render with data", () => {
		const { container } = render(<PercentageBar data={data} />);
		expect(container).toMatchSnapshot();
	});
});
