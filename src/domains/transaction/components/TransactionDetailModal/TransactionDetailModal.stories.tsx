import { boolean } from "@storybook/addon-knobs";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";

import { TransactionDetailModal } from "./TransactionDetailModal";

export default { title: "Domains / Transaction / Components / TransactionDetailModal" };

export const Default = () => (
	<TransactionDetailModal
		transactionItem={TransactionFixture}
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
	/>
);
