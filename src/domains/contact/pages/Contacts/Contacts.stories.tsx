import { Contact } from "@arkecosystem/platform-sdk-profiles";
import { action } from "@storybook/addon-actions";
import React from "react";

import { Contacts } from "./Contacts";

export default { title: "Contacts / Pages / Contacts" };

export const Default = () => {
	return (
		<div>
			<Contacts onSearch={action("onSearch")} />
		</div>
	);
};

export const WithContacts = () => {
	const contacts = [
		new Contact({
			id: "robank",
			name: "ROBank",
			starred: true,
			addresses: [{ coin: "Ark", network: "mainnet", address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" }],
		}),
		new Contact({
			id: "olebank",
			name: "OLEBank",
			starred: false,
			addresses: [
				{ coin: "Ark", network: "mainnet", address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" },
				{ coin: "Bitcoin", network: "mainnet", address: "15pyr1HRAxpq3x64duXav1csmyCtXXu9G8" },
				{ coin: "Ethereum", network: "mainnet", address: "0x5e8f7a63e31c759ef0ad5e71594e838b380d7c33" },
			],
		}),
	];

	return (
		<div>
			<Contacts contacts={contacts} onSearch={action("onSearch")} />
		</div>
	);
};
