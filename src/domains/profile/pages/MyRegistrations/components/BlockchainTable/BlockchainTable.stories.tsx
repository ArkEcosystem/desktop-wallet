import React from "react";

import { BlockchainTable } from "./BlockchainTable";

export default {
	title: "Domains / Profile / Pages / MyRegistrations / Components / BlockchainTable",
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
