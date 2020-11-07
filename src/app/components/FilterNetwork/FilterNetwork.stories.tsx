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
			id: "ark.devnet",
			coin: "DARK",
			name: "ARK",
			isSelected: true,
		},
		{
			id: "eth.mainnet",
			coin: "ETH",
			name: "Ethereum",
			isSelected: true,
		},
		{
			id: "btc.mainnet",
			coin: "BTC",
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
