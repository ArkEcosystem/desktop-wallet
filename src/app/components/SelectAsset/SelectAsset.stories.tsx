import React from "react";

import { SelectAsset } from "./SelectAsset";

export default {
	title: "Components / SelectAsset",
};

export const Default = () => {
	const assets = [
		{
			icon: "Ark",
			name: "Ark Ecosystem",
			className: "text-theme-danger-400 border-theme-danger-200",
		},
		{
			icon: "Bitcoin",
			name: "Bitcoin",
			className: "text-theme-warning-400 border-theme-warning-200",
		},
		{
			icon: "Ethereum",
			name: "Ethereum",
			className: "text-theme-neutral-800 border-theme-neutral-600",
		},
	];

	return (
		<div className="">
			<div className="mt-10 w-128">
				<SelectAsset assets={assets} />
			</div>
		</div>
	);
};
