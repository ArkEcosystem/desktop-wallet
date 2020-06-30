import React from "react";

import { BusinessTable } from "./BusinessTable";

export default {
	title: "Domains / Profile / Pages / MyRegistrations / Components / BusinessTable",
};

export const Default = () => {
	const registrations = [
		{
			agent: "OLEBank",
			businessName: "ARK Ecosystem",
			history: [],
			website: "",
			msq: true,
			repository: [],
		},
		{
			agent: "OLEBank",
			businessName: "ARK Ecosystem",
			history: [],
			website: "",
			msq: true,
			repository: [],
		},
	];

	return <BusinessTable data={registrations} handleDropdown={console.log} />;
};
