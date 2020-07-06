import React from "react";

import { Select } from "./SelectDropdown";

export default {
	title: "App / Components / Select",
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
		<div className="max-w-xs space-y-4">
			<Select placeholder="Select option" options={options} />
			<Select placeholder="Invalid" isInvalid options={options} />
			<Select placeholder="Disabled" disabled options={options} />
			<div className="mt-4">With default value</div>
			<Select placeholder="Disabled" options={options} defaultValue="3" />

			<div className="mt-4">With default value (disabled)</div>
			<Select placeholder="Disabled" disabled options={options} defaultValue="3" />
		</div>
	);
};
