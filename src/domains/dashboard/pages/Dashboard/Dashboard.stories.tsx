import React from "react";

import { balances, networks, portfolioPercentages, wallets } from "../../data";
import { Dashboard } from "./Dashboard";

export default { title: "Domains / Dashboard / Pages / Dashboard" };

export const Default = () => (
	<Dashboard balances={balances} networks={networks} wallets={wallets} portfolioPercentages={portfolioPercentages} />
);

export const FewerWallets = () => (
	<Dashboard
		balances={balances}
		networks={networks}
		wallets={wallets.concat().splice(0, 2)}
		portfolioPercentages={portfolioPercentages}
	/>
);

export const Empty = () => <Dashboard wallets={[]} networks={networks} portfolioPercentages={portfolioPercentages} />;
