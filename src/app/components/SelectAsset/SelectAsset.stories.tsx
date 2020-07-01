import React from "react";

import { SelectAsset } from "./SelectAsset";

export default {
	title: "App / Components / SelectAsset",
};

export const Default = () => {
	const assets = [
		{
			icon: "Ark",
			name: "ARK Ecosystem",
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
		{
			icon: "Lisk",
			name: "Lisk",
			className: "text-theme-primary-600 border-theme-primary-400",
		},
		{
			icon: "Ripple",
			name: "Ripple",
			className: "text-theme-primary-700 border-theme-primary-500",
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
