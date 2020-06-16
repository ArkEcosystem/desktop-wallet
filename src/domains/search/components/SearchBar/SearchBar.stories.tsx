import { text, withKnobs } from "@storybook/addon-knobs";
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
			<SearchBar
				extra={
					<SearchBarOptions
						options={options}
						selectedOption={selectedOption}
						onSelect={(option: any) => void 0}
					/>
				}
			/>
		</div>
	);
};
