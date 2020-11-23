import React from "react";

import { SelectRegistrationType } from "./SelectRegistrationType";

export default { title: "Domains / Transaction / Components / SelectRegistrationType" };

const registrationTypes = [
	{
		value: "entityRegistration",
		label: "Business",
	},
	{
		value: "entityRegistration",
		label: "Product",
	},
	{
		value: "entityRegistration",
		label: "Plugin",
	},
];

export const Default = () => (
	<div className="p-5 w-128">
		<SelectRegistrationType options={registrationTypes} />
	</div>
);
