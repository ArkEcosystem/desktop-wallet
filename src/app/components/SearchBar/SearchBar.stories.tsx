import { withKnobs } from "@storybook/addon-knobs";
import { SearchBarFilters } from "app/components/SearchBar/SearchBarFilters";
import { SearchBarOptions } from "app/components/SearchBar/SearchBarOptions";
import React from "react";

import { SearchBar } from "./SearchBar";

export default { title: "App / Components / SearchBar", decorators: [withKnobs] };

export const Default = () => (
	<div className="w-full h-full">
		<SearchBar />
	</div>
);

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
				<SearchBarOptions options={options} selectedOption={selectedOption} onSelect={() => void 0} />
			</SearchBar>
		</div>
	);
};

export const WithFilters = () => {
	const networks = [
		{ name: "ARK", isSelected: true },
		{ name: "Ethereum", isSelected: true },
		{ name: "Bitcoin", isSelected: false },
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
