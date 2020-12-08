import React from "react";

import { Select } from "./SelectDropdown";

export default {
	title: "App / Components / Select Dropdown",
};

export const Dropdown = () => {
	const options = [
		{
			label: "Option 1",
			value: "1",
		},
		{
			label: "Option 2",
			value: "2",
		},
		{
			label: "Option 3",
			value: "3",
		},
	];

	return (
		<div className="space-y-4 max-w-xs">
			<Select options={options} placeholder="Select option" />
			<Select options={options} placeholder="Invalid" isInvalid />
			<Select options={options} placeholder="Disabled" disabled />

			<div className="mt-4">With default value</div>
			<Select placeholder="Disabled" options={options} defaultValue="3" />

			<div className="mt-4">With default value (disabled)</div>
			<Select options={options} defaultValue="3" placeholder="Disabled" disabled />
		</div>
	);
};
