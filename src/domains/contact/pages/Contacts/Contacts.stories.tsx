import { action } from "@storybook/addon-actions";
import React from "react";

import { contacts as data } from "../../data";
import { Contacts } from "./Contacts";

export default { title: "Domains / Contact / Pages / Contacts" };

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

export const Default = () => {
	return (
		<div>
			<Contacts assets={assets} onSearch={action("onSearch")} />
		</div>
	);
};

export const WithContacts = () => {
	return (
		<div>
			<Contacts assets={assets} contacts={data} onSearch={action("onSearch")} />
		</div>
	);
};
