import React from "react";

import { FilterWallets } from "./FilterWallets";

export default {
	title: "Domains / Dashboard / Components / FilterWallets",
};

export const Default = () => {
	const networks = [
		{
			name: "ARK",
			isSelected: true,
		},
		{
			name: "Ethereum",
			isSelected: true,
		},
		{
			name: "Bitcoin",
			isSelected: false,
		},
	];

	let visiblePortfolioView = true;
	let visibleTransactionsView = true;

	return (
		<div className="w-128">
			<FilterWallets
				networks={networks}
				visibleTransactionsView={visibleTransactionsView}
				visiblePortfolioView={visiblePortfolioView}
				onNetworkChange={(changedNetwork: any, newNetworksList: any) => {
					console.log("changed network", changedNetwork);
					console.log("changed network new list", newNetworksList);
				}}
				togglePortfolioView={(isChecked: boolean) => (visiblePortfolioView = isChecked)}
				toggleTransactionsView={(isChecked: boolean) => (visibleTransactionsView = isChecked)}
				onViewAllNetworks={() => alert("View all networks")}
				onWalletsDisplayType={() => alert("Display wallet event")}
			/>
		</div>
	);
};
