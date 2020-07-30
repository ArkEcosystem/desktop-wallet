import { availableNetworksMock } from "domains/network/data";
import React from "react";

import { CreateContact } from "./CreateContact";

export default {
	title: "Domains / Contact / Components / CreateContact",
};

export const Default = () => (
	<CreateContact
		isOpen={true}
		networks={availableNetworksMock}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
		onSave={() => alert("saved")}
	/>
);
