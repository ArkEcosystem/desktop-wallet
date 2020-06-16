import React from "react";

import { transactions } from "../../data";
import { Transactions } from "./Transactions";

export default { title: "Dashboard / Components / Transactions" };

export const Default = () => {
	return (
		<div>
			<Transactions transactions={transactions} />
		</div>
	);
};
