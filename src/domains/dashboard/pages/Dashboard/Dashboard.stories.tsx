import React from "react";
import { Dashboard } from "./Dashboard";
import { networks, wallets, transactions } from "../../data";

export default { title: "Dashboard / Pages" };

export const Default = () => {
	return (
		<div>
			<Dashboard networks={networks} wallets={wallets} transactions={transactions} />
		</div>
	);
};
