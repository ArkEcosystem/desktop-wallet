import React from "react";

import { CreateContact } from "./CreateContact";

export default {
	title: "Contacts / Components / Create Contact",
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
			icon: "Bitcoin",
		},
		{
			label: "Ethereum",
			value: "eth",
			icon: "Ethereum",
		},
	];

	return (
		<CreateContact
			isOpen={true}
			networks={networks}
			onClose={() => alert("closed")}
			onCancel={() => alert("cancelled")}
			onSave={() => alert("saved")}
		/>
	);
};
