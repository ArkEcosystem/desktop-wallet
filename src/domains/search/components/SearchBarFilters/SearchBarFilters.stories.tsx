import { withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { SearchBarFilters } from "./SearchBarFilters";

export default {
	title: "Search / Search Bar Filters",
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
		<SearchBarFilters
			networks={networks}
			onNetworkChange={(changedNetwork: any, newNetworksList: any) => {
				console.log("changed network", changedNetwork);
				console.log("changed network new list", newNetworksList);
			}}
			onViewAllNetworks={() => alert("View all networks")}
		/>
	);
};
