import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render, waitFor } from "testing-library";

import { LineChart } from "./LineChart";

const period = "22 Jun - 28 Jun";
const data = [{ name: "Mmn", label: "22 Jun, 2020", usd: 1000, btc: 2400, formatted: { usd: "1,000", btc: "0.26" } }];
const lines = [
	{
		dataKey: "btc",
		label: "BTC",
		color: "warning-600",
	},
];

describe("LineChart", () => {
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
			<div>
				<LineChart width={200} period={period} data={data} lines={lines} />
			</div>,
		);
		const chartWrapper = getByTestId("line-chart-wrapper");
		expect(chartWrapper).toBeTruthy();
		await waitFor(() => expect(getByTestId("line-chart-dot-0")).toBeTruthy(), { timeout: 1000 });
		act(() => {
			fireEvent.mouseMove(chartWrapper.children[1].children[0]);
		});
	});
});
