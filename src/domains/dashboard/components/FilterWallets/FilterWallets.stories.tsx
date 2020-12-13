import React from "react";

import { FilterWallets } from "./FilterWallets";

export default {
	title: "Domains / Dashboard / Components / FilterWallets",
};

const filterProperties = {
	networks: [],
	viewType: "list",
	walletsDisplayType: "all",
	selectedNetworkIds: [],
	showTransactions: true,
	useTestNetworks: true,
	showToggleViews: true,
	isFilterChanged: false,
};
export const Default = () => (
	<div className="w-128">
		<FilterWallets {...(filterProperties as any)} onChange={console.log} />
	</div>
);
