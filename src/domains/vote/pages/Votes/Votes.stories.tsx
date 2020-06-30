import React from "react";

import { Votes } from "./Votes";

export default { title: "Domains / Vote / Pages / Votes" };

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
		<div>
			<Votes assets={assets} />
		</div>
	);
};
