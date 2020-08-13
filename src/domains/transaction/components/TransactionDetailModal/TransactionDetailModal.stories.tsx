import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { TransactionDetailModal } from "./TransactionDetailModal";

export default { title: "Domains / Transaction / Components / TransactionDetailModal" };

const transactionItem = {
	type: () => "transfer",
};

export const Default = () => (
	<TransactionDetailModal
		transactionItem={transactionItem}
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("closed")}
	/>
);
