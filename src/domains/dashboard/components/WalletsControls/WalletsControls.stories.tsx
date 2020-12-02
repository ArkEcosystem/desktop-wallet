import React from "react";

import { WalletsControls } from "./WalletsControls";

export default {
	title: "Domains / Dashboard / Components / WalletsControls",
};

export const Default = () => (
	<div className="flex">
		<h2 className="w-2/4 mt-1">Wallets</h2>
		<div className="w-2/4">
			<WalletsControls
				onCreateWallet={() => alert("Create wallet")}
				onImportWallet={() => alert("Import wallet")}
				onSelectGridView={() => console.log("Show grid view")}
				onSelectListView={() => console.log("Show list view")}
				viewType="grid"
			/>
		</div>
	</div>
);
