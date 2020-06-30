import React from "react";

import { BlockchainTable } from "./BlockchainTable";

export default {
	title: "Profile / Pages / My Registrations / Components / Blockchain Table",
};

export const Default = () => {
	const registrations = [
		{
			agent: "OLEBank",
			blockchainName: "ARK Ecosystem",
			history: [],
			website: "",
			msq: true,
			repository: [],
		},
		{
			agent: "OLEBank",
			blockchainName: "ARK Ecosystem",
			history: [],
			website: "",
			msq: true,
			repository: [],
		},
	];

	return <BlockchainTable data={registrations} handleDropdown={console.log} />;
};
