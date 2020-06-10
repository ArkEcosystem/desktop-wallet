import React from "react";
import { Dropdown } from "./Dropdown";

export default {
	title: "Components / Dropdown",
};

export const Default = () => {
	const options = [
		{ label: "Option 1", value: "1" },
		{ label: "Option 2", value: "2" },
		{ label: "Option 3", value: "4" },
		{ label: "Option 4", value: "4" },
	];

	return (
		<div className="">
			Default with options array
			<div className="w-20 ml-40 mt-10">
				<Dropdown
					toggleIcon="Settings"
					options={options}
					onSelect={(option: any) => console.log(option)}
				></Dropdown>
			</div>
		</div>
	);
};

export const ContentAsSlot = () => {
	return (
		<div className="">
			Custom html dropdown content
			<div className="w-20 ml-40 mt-10">
				<Dropdown toggleIcon="Settings" onSelect={(option: any) => console.log(option)}>
					<div className="p-5">Custom content (default slot)</div>
				</Dropdown>
			</div>
		</div>
	);
};

export const CustomToggleIcon = () => {
	return (
		<div className="">
			Custom toggle svg icon:
			<div className="w-20 ml-40 mt-10">
				<Dropdown toggleIcon="Upload" onSelect={(option: any) => console.log(option)}>
					<div className="p-5">Custom content (default slot)</div>
				</Dropdown>
			</div>
		</div>
	);
};
