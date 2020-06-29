import React from "react";

import { DelegateTable } from "./DelegateTable";

export default {
	title: "Profile / Pages / My Registrations / Components / Delegate Table",
};

export const Default = () => {
	const registrations = [
		{
			delegate: "OLEBank",
			rank: "#2",
			history: [],
			website: "",
			msq: true,
			confirmed: true,
			repository: [],
		},
		{
			delegate: "OLEBank",
			rank: "#352",
			history: [],
			website: "",
			confirmed: false,
			repository: [],
		},
	];

	return <DelegateTable data={registrations} handleDropdown={console.log} />;
};
