import React from "react";

import { PercentageBar } from "./PercentageBar";

export default {
	title: "App / Components / PercentageBar",
};

export const Blank = () => {
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
	return <PercentageBar title="Total portfolio" data={data} />;
};
