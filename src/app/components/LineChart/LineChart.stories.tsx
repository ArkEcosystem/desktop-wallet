import React from "react";

import { LineChart } from "./LineChart";

export default {
	title: "Components / Line Chart",
};

export const Default = () => {
	const data = [
		{ name: "Mon", label: "22 Jun, 2020", usd: 1000, btc: 2400 },
		{ name: "Tue", label: "23 Jun, 2020", usd: 3000, btc: 4567 },
		{ name: "Wed", label: "24 Jun, 2020", usd: 3200, btc: 1398 },
		{ name: "Thu", label: "25 Jun, 2020", usd: 4000, btc: 9800 },
		{ name: "Fri", label: "26 Jun, 2020", usd: 1200, btc: 2000 },
		{ name: "Sat", label: "27 Jun, 2020", usd: 3000, btc: 4800 },
		{ name: "Sun", label: "28 Jun, 2020", usd: 8000, btc: 1800 },
	];
	const lines = [
		{
			dataKey: "btc",
			className: "text-theme-warning-600",
		},
		{
			dataKey: "usd",
			className: "text-theme-success-600",
		},
	];
	return (
		<div>
			<LineChart data={data} lines={lines} />
		</div>
	);
};
