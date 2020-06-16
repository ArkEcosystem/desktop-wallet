import React from "react";

import { SelectNetwork } from "./SelectNetwork";

export default {
	title: "Input / Select Network",
};

export const Default = () => {
	const networks = [
		{
			name: "Ark",
			isSelected: true,
		},
		{
			name: "Eth",
			isSelected: true,
		},
		{
			name: "Btc",
			isSelected: false,
		},
	];
	return (
		<div>
			<SelectNetwork networks={networks} onViewAll={() => alert("View all networks")}></SelectNetwork>
		</div>
	);
};
