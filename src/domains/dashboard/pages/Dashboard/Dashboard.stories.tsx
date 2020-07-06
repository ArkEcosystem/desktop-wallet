import React from "react";

import { balances, networks, portfolioPercentages, transactions, wallets } from "../../data";
import { Dashboard } from "./Dashboard";

export default { title: "Domains / Dashboard / Pages / Dashboard" };

export const Default = () => {
	return (
		<div className="bg-theme-neutral-100 pt-1 -m-5 -mt-6">
			<Dashboard
				balances={balances}
				networks={networks}
				wallets={wallets}
				transactions={transactions}
				portfolioPercentages={portfolioPercentages}
			/>
		</div>
	);
};

export const FewerWallets = () => {
	return (
		<div className="bg-theme-neutral-100 pt-1 -m-5 -mt-6">
			<Dashboard
				balances={balances}
				networks={networks}
				wallets={wallets.concat().splice(0, 2)}
				transactions={transactions}
				portfolioPercentages={portfolioPercentages}
			/>
		</div>
	);
};

export const Empty = () => {
	return (
		<div className="bg-theme-neutral-100 pt-1 -m-5 -mt-6">
			<Dashboard networks={networks} portfolioPercentages={portfolioPercentages} />
		</div>
	);
};
