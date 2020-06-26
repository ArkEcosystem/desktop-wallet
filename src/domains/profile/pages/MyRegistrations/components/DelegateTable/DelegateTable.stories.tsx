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
			repository: [],
		},
		{
			delegate: "OLEBank",
			rank: "#352",
			history: [],
			website: "",
			msq: true,
			repository: [],
		},
	];

	return <DelegateTable data={registrations} />;
};
