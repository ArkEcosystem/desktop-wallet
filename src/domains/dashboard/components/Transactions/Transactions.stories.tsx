import React from "react";

import { transactions } from "../../data";
import { Transactions } from "./Transactions";

export default { title: "Domains / Dashboard / Components / Transactions" };

export const Default = () => (
	<div>
	    {/* @ts-ignore - TODO: brittle fixture */}
		<Transactions transactions={transactions} fetchMoreAction={() => console.log("fetchMoreAction")} />
	</div>
);
