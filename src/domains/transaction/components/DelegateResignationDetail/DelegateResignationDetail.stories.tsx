import { boolean } from "@storybook/addon-knobs";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";

import { DelegateResignationDetail } from "./DelegateResignationDetail";

export default { title: "Domains / Transaction / Components / DelegateResignationDetail" };

export const Default = () => (
	<DelegateResignationDetail
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		transaction={TransactionFixture}
		wallet={TransactionFixture.wallet()}
	/>
);
