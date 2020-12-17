import React from "react";

import { WalletsControls } from "./WalletsControls";

export default {
	title: "Domains / Dashboard / Components / WalletsControls",
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
	<div className="flex">
		<h2 className="w-2/4 mt-1">Wallets</h2>
		<div className="w-2/4">
			<WalletsControls
				filterProperties={filterProperties as any}
				onCreateWallet={() => alert("Create wallet")}
				onImportWallet={() => alert("Import wallet")}
				onSelectGridView={() => console.log("Show grid view")}
				onSelectListView={() => console.log("Show list view")}
			/>
		</div>
	</div>
);
