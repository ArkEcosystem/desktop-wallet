import React from "react";

import { FilterNetwork } from "./FilterNetwork";

export default {
	title: "App / Components / FilterNetwork",
};

export const Default = () => {
	const networks = [
		{
			name: "Ark",
			isSelected: true,
		},
		{
			name: "Ethereum",
			isSelected: true,
		},
		{
			name: "Bitcoin",
			isSelected: false,
		},
	];
	return (
		<div>
			<FilterNetwork networks={networks} onViewAll={() => alert("View all networks")} />
		</div>
	);
};
