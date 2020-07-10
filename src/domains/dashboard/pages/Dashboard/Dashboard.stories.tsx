import React from "react";

import { balances, networks, portfolioPercentages, transactions, wallets } from "../../data";
import { Dashboard } from "./Dashboard";

export default { title: "Domains / Dashboard / Pages / Dashboard" };

export const Default = () => {
	return (
		<div className="pt-1 -m-5 -mt-6 bg-theme-neutral-contrast">
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
		<div className="pt-1 -m-5 -mt-6 bg-theme-neutral-contrast">
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
		<div className="pt-1 -m-5 -mt-6 bg-theme-neutral-contrast">
			<Dashboard networks={networks} portfolioPercentages={portfolioPercentages} />
		</div>
	);
};
