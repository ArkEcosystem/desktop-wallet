import React from "react";

import { networks, portfolioPercentages,transactions, wallets } from "../../data";
import { Dashboard } from "./Dashboard";

export default { title: "Dashboard / Pages" };

export const Default = () => {
	return (
		<div>
			<Dashboard
				networks={networks}
				wallets={wallets}
				transactions={transactions}
				portfolioPercentages={portfolioPercentages}
			/>
		</div>
	);
};
