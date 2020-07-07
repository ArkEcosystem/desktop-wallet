import { action } from "@storybook/addon-actions";
import React from "react";

import { CreateWallet } from "./CreateWallet";

export default { title: "Domains / Wallet / Pages / CreateWallet" };

const mnemonic = [
	"lorem",
	"ipsum",
	"dolor",
	"sit",
	"amet",
	"consectetur",
	"adipisicing",
	"elit",
	"nihil",
	"nisi",
	"natus",
	"adipisci",
];

const networks = [
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

export const Default = () => (
	<CreateWallet
		mnemonic={mnemonic}
		networks={networks}
		onCopy={action("onCopy")}
		onDownload={action("onDownload")}
		onSubmit={action("onSubmit")}
	/>
);
