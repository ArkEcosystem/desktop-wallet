import React from "react";

import { UpdateContact } from "./UpdateContact";

export default {
	title: "Contacts / Components / Update Contact",
};

export const Default = () => {
	const networks = [
		{
			label: "Ark Ecosystem",
			value: "ark",
			icon: "Ark",
		},
		{
			label: "Bitcoin",
			value: "btc",
			icon: "Btc",
		},
		{
			label: "Ethereum",
			value: "eth",
			icon: "Eth",
		},
	];

	const contact = {
		name: () => "Oleg Gelo",
		addresses: () => [
			{ coin: "Btc", network: "Bitcoin", address: "15pyr1HRAxpq3x64duXav1csmyCtXXu9G8", avatar: "test1" },
			{ coin: "Bch", network: "Bitcoin Cash", address: "15pyr1HRAxpq3x64duXav1csmyCtXXu9G8", avatar: "test1" },
		],
	};

	return (
		<UpdateContact
			isOpen={true}
			networks={networks}
			contact={contact}
			onClose={() => alert("closed")}
			onCancel={() => alert("cancelled")}
			onSave={() => alert("saved")}
		/>
	);
};
