import React from "react";

import { TransactionSendIPFS } from "./TransactionSendIPFS";

export default { title: "Domains / Transaction / Pages / Send IPFS Modal" };

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
		<div className="mt-15">
			<TransactionSendIPFS assets={assets} />
		</div>
	);
};
