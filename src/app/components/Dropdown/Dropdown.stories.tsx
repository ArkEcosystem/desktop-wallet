import React from "react";

import { Dropdown } from "./Dropdown";

export default {
	title: "App / Components / Dropdown",
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
			<div className="mt-10 ml-40 w-20">
				<Dropdown toggleIcon="Settings" options={options} onSelect={(option: any) => console.log(option)} />
			</div>
		</div>
	);
};

export const ContentAsSlot = () => (
	<div className="">
		Custom html dropdown content
		<div className="mt-10 ml-40 w-20">
			<Dropdown toggleIcon="Settings" onSelect={(option: any) => console.log(option)}>
				<div className="p-5">Custom content (default slot)</div>
			</Dropdown>
		</div>
	</div>
);

export const CustomToggleIcon = () => (
	<div className="">
		Custom toggle svg icon:
		<div className="mt-10 ml-40 w-20">
			<Dropdown toggleIcon="Upload" onSelect={(option: any) => console.log(option)}>
				<div className="p-5">Custom content (default slot)</div>
			</Dropdown>
		</div>
	</div>
);

export const CustomToggleContent = () => (
	<div className="">
		Custom toggle html:
		<div className="mt-10 ml-40 w-20">
			<Dropdown
				toggleContent={(isOpen: boolean) => <div>{isOpen ? "open" : "closed"}</div>}
				toggleIcon="Upload"
				onSelect={(option: any) => console.log(option)}
			>
				<div className="p-5">Custom content (default slot)</div>
			</Dropdown>
		</div>
	</div>
);
