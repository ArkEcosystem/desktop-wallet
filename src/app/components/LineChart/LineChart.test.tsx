import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render, waitFor } from "testing-library";

import { LineChart } from "./LineChart";

const period = "22 Jun - 28 Jun";
const data = [{ btc: 2400, formatted: { btc: "0.26", usd: "1,000" }, label: "22 Jun, 2020", name: "Mmn", usd: 1000 }];
const lines = [
	{
		color: "warning-600",
		dataKey: "btc",
		label: "BTC",
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
