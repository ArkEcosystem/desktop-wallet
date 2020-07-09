import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { FilterNetwork } from "./FilterNetwork";

export default {
	title: "App / Components / FilterNetwork",
	decorators: [withKnobs],
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
		<FilterNetwork
			networks={networks}
			onViewAll={() => alert("View all networks")}
			hideViewAll={boolean("Hide View All", false)}
		/>
	);
};
