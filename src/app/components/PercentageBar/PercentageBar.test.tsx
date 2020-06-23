import { render } from "@testing-library/react";
import React from "react";

import { PercentageBar } from "./PercentageBar";

describe("PercentageBar", () => {
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
