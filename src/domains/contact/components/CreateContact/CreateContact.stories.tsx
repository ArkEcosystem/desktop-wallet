import React from "react";

import { networks } from "../../data";
import { CreateContact } from "./CreateContact";

export default {
	title: "Domains / Contact / Components / CreateContact",
};

export const Default = () => {
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
