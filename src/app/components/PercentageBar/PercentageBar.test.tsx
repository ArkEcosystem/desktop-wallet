import React from "react";
import { render } from "testing-library";

import { PercentageBar } from "./PercentageBar";

const data = [
	{
		label: "ARK",
		value: 40,
		color: "danger-500",
	},
	{
		label: "BTC",
		value: 25,
		color: "warning-500",
	},
	{
		label: "ETH",
		value: 20,
		color: "primary-500",
	},
	{
		label: "Other",
		value: 15,
		color: "neutral-400",
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
