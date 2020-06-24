import {  render, waitFor } from "@testing-library/react";
import React from "react";

import { LineChart } from "./LineChart";

describe("LineChart", () => {
	const data = [{ name: "Mon", label: "22 Jun, 2020", usd: 1000, btc: 2400 }];

	const lines = [
		{
			dataKey: "btc",
			label: "BTC",
			color: "warning-600",
		},
	];

	const period = "22 Jun - 28 Jun";

	it("should render", () => {
		const { container } = render(<LineChart data={[]} lines={[]} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with data", () => {
		const { container } = render(<LineChart period={period} data={data} lines={lines} />);
		expect(container).toMatchSnapshot();
	});

	it("should render chart dots", async () => {
		const { getByTestId } = render(
			<div className="w-64">
				<LineChart width={300} period={period} data={data} lines={lines} />
			</div>,
		);
		const chartWrapper = getByTestId("line-chart-wrapper");
		expect(chartWrapper).toBeTruthy();
		await waitFor(() => expect(getByTestId("line-chart-dot-0")).toBeTruthy(), { timeout: 1000 });
	});
});
