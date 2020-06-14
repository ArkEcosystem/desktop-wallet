import React from "react";
import { Transactions } from "./Transactions";
import { transactions } from "../../data";

export default { title: "Dashboard / Components / Transactions" };

export const Default = () => {
	return (
		<div>
			<Transactions transactions={transactions} />
		</div>
	);
};
