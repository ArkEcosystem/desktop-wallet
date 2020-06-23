import React from "react";

import { FilterWallets } from "./FilterWallets";

export default {
	title: "Dashboard / Components / FilterWallets",
};

export const Default = () => {
	const networks = [
		{
			name: "Ark",
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
				visibleTransactionsView={visibleTransactionsView}
				visiblePortfolioView={visiblePortfolioView}
				networks={networks}
				onNetworkChange={(changedNetwork: any, newNetworksList: any) => {
					console.log("changed network", changedNetwork);
					console.log("changed network new list", newNetworksList);
				}}
				togglePortfolioView={(isChecked: boolean) => (visiblePortfolioView = isChecked)}
				toggleTransactionsView={(isChecked: boolean) => (visibleTransactionsView = isChecked)}
				onWalletsDisplay={() => alert("Display wallets  event")}
				onViewAllNetworks={() => alert("View all networks")}
			/>
		</div>
	);
};
