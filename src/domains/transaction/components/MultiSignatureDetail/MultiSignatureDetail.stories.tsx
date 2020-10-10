import { boolean } from "@storybook/addon-knobs";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";

import { MultiSignatureDetail } from "./MultiSignatureDetail";
export default { title: "Domains / Transaction / Components / MultiSignatureDetail" };

export const Default = () => (
	<MultiSignatureDetail
		// @ts-ignore
		transactions={TransactionFixture}
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
	/>
);
