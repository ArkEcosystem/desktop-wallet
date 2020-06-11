import React from "react";
import { WalletsControls } from "./WalletsControls";

export default {
	title: "Wallets / Components / WalletsControls",
};

export const Default = () => {
	const networks = [
		{
			name: "Ark",
			isSelected: true,
		},
		{
			name: "Eth",
			isSelected: true,
		},
		{
			name: "Btc",
			isSelected: false,
		},
	];

	const filterProperties = {
		visibleTransactionsView: true,
		visiblePortfolioView: true,
		networks,
		onNetworkChange: (changedNetwork: any, newNetworksList: any) => {
			console.log("changed network", changedNetwork);
			console.log("changed network new list", newNetworksList);
		},
		togglePortfolioView: (isChecked: boolean) => {
			console.log("show portfolio view", isChecked);
		},
		toggleTransactionsView: (isChecked: boolean) => {
			console.log("show portfolio view", isChecked);
		},
		onWalletsDisplay: () => {
			alert("on Wallet display");
		},
		onViewAllNetworks: () => {
			alert("on view all networks");
		},
	};

	return (
		<div className="flex">
			<h2 className="w-2/4 mt-1">Wallets</h2>
			<div className="w-2/4">
				<WalletsControls
					onCreateWallet={() => alert("Create wallet")}
					onImportWallet={() => alert("Import wallet")}
					onSelectGridView={() => console.log("Show grid view")}
					onSelectListView={() => console.log("Show list view")}
					filterProperties={filterProperties}
					viewType="grid"
				></WalletsControls>
			</div>
		</div>
	);
};
