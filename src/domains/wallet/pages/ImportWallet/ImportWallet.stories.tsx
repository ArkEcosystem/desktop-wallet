import React from "react";

import { ImportWallet } from "./ImportWallet";

export default {
	title: "Wallets / Pages / Import Wallet",
};

const networks = [
	{
		id: 1,
		name: "ARK Ecosystem",
		icon: "Ark",
	},
	{
		id: 2,
		name: "Ethereum",
		icon: "Eth",
	},
	{
		id: 3,
		name: "Bitcoin",
		icon: "Btc",
	},
];

export const Default = () => (
	<div className="w-full h-full">
		<ImportWallet networks={networks} />
	</div>
);
