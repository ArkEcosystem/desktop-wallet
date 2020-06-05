import React from "react";
import { ImportWallet } from "./ImportWallet";

export default {
	title: "Pages / Wallets / Import Wallet",
};

const networks = [
	{
		id: 1,
		name: "ARK Ecosystem",
		icon: "ark",
	},
	{
		id: 2,
		name: "Ethereum",
		icon: "eth",
	},
	{
		id: 3,
		name: "Bitcoin",
		icon: "btc",
	},
];

export const Default = () => (
	<div className="w-full h-full">
		<ImportWallet networks={networks} />
	</div>
);
