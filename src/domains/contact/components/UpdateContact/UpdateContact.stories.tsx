import { availableNetworksMock } from "domains/network/data";
import React from "react";

import { contact2 as contact } from "../../data";
import { UpdateContact } from "./UpdateContact";

export default {
	title: "Domains / Contact / Components / UpdateContact",
};

export const Default = () => {
	return (
		<UpdateContact
			isOpen={true}
			networks={availableNetworksMock}
			contact={contact}
			onClose={() => alert("closed")}
			onCancel={() => alert("cancelled")}
			onDelete={() => alert("deleted")}
			onSave={console.log}
		/>
	);
};
