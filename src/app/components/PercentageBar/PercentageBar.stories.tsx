import React from "react";

import { PercentageBar } from "./PercentageBar";

export default {
	title: "Components / Percentage Bar",
};

export const Blank = () => {
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
	return <PercentageBar title="Total portfolio" data={data} />;
};
