import React from "react";
import { Wallets } from "./Wallets";
import { networks, wallets } from "../../data";

export default { title: "Dashboard / Components / Wallets" };

export const Default = () => {
	// Wallet filter properties
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
			console.log("show transactions view", isChecked);
		},
		onWalletsDisplay: () => {
			alert("on Wallet display");
		},
		onViewAllNetworks: () => {
			alert("on view all networks");
		},
	};

	return (
		<div>
			<Wallets title="Wallets" wallets={wallets} filterProperties={filterProperties} />
		</div>
	);
};
