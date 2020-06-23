import { action } from "@storybook/addon-actions";
import React from "react";

import { Contacts } from "./Contacts";

export default { title: "Contacts / Pages / Contacts" };

export const Default = () => {
	return (
		<div>
			<Contacts onSearch={action("onSearch")} onAddContact={action("onAddContact")} />
		</div>
	);
};

export const WithContacts = () => {
	const contacts = [
		{
			id: "robank",
			name: "ROBank",
			addresses: [{ coin: "ark", network: "mainnet", address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" }],
			starred: true,
			actions: [
				{ label: "Send", value: "send" },
				{ label: "Edit", value: "edit" },
				{ label: "Delete", value: "delete" },
			],
		},
		{
			id: "olebank",
			name: "OLEBank",
			addresses: [
				{ coin: "ark", network: "mainnet", address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" },
				{ coin: "btc", network: "mainnet", address: "15pyr1HRAxpq3x64duXav1csmyCtXXu9G8" },
				{ coin: "eth", network: "mainnet", address: "0x5e8f7a63e31c759ef0ad5e71594e838b380d7c33" },
			],
			starred: false,
			actions: [
				{ label: "Send", value: "send" },
				{ label: "Edit", value: "edit" },
				{ label: "Delete", value: "delete" },
			],
		},
	];

	return (
		<div>
			<Contacts contacts={contacts} onSearch={action("onSearch")} onAddContact={action("onAddContact")} />
		</div>
	);
};
