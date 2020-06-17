import { text, withKnobs } from "@storybook/addon-knobs";
import { SearchBarFilters } from "domains/search/components/SearchBarFilters";
import { SearchBarOptions } from "domains/search/components/SearchBarOptions";
import React from "react";

import { SearchBar } from "./SearchBar";

export default { title: "Search / Search Bar", decorators: [withKnobs] };

export const Default = () => {
	return (
		<div className="w-full h-full">
			<SearchBar />
		</div>
	);
};

export const WithOptions = () => {
	const options = [
		{ label: "Wallet", value: "wallet" },
		{ label: "Plugin", value: "plugin" },
		{ label: "Delegate", value: "delegate" },
	];
	const selectedOption = null;

	return (
		<div className="w-full h-full">
			<SearchBar>
				<SearchBarOptions
					options={options}
					selectedOption={selectedOption}
					onSelect={(option: any) => void 0}
				/>
			</SearchBar>
		</div>
	);
};

export const WithFilters = () => {
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
		<div className="w-full h-full">
			<SearchBar>
				<SearchBarFilters
		      networks={networks}
		      onNetworkChange={(changedNetwork: any, newNetworksList: any) => {
		        console.log("changed network", changedNetwork);
		        console.log("changed network new list", newNetworksList);
		      }}
		      onViewAllNetworks={() => alert("View all networks")}
		    />
			</SearchBar>
		</div>
	);
};
