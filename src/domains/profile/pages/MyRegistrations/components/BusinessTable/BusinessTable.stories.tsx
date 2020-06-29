import React from "react";

import { BusinessTable } from "./BusinessTable";

export default {
	title: "Profile / Pages / My Registrations / Components / Business Table",
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
