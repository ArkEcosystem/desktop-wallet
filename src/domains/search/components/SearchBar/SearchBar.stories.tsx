import { text, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { SearchBar } from "./SearchBar";

export default { title: "Search / Search Bar", decorators: [withKnobs] };

export const Default = () => {
	return (
		<div className="w-full h-full">
			<SearchBar onTypeSelect={(option: any) => void 0} />
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
			<SearchBar options={options} selectedOption={selectedOption} onTypeSelect={(option: any) => void 0} />
		</div>
	);
};
