import React from "react";

import { contact2 as contact } from "../../data";
import { UpdateContact } from "./UpdateContact";

export default {
	title: "Domains / Contact / Components / Update Contact",
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
		<UpdateContact
			isOpen={true}
			networks={networks}
			contact={contact}
			onClose={() => alert("closed")}
			onCancel={() => alert("cancelled")}
			onDelete={() => alert("deleted")}
			onSave={() => alert("saved")}
		/>
	);
};
