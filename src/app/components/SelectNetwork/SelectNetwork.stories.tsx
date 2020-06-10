import React from "react";
import { SelectNetwork } from "./SelectNetwork";

export default {
	title: "Input / Select Network",
};

export const Default = () => {
	const networks = [
		{
			name: "ark",
			isSelected: true,
		},
		{
			name: "eth",
			isSelected: true,
		},
		{
			name: "btc",
			isSelected: false,
		},
	];
	return (
		<div>
			<SelectNetwork networks={networks} onViewAll={() => alert("View all networks")}></SelectNetwork>
		</div>
	);
};
