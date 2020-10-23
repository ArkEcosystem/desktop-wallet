import { boolean } from "@storybook/addon-knobs";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";

import { TransferDetail } from "./TransferDetail";

export default { title: "Domains / Transaction / Components / TransferDetail" };

export const Default = () => (
	<TransferDetail
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		transaction={{ ...TransactionFixture, blockId: () => "adsad12312xsd1w312e1s13203e12" }}
    wallet={TransactionFixture.wallet()}
	/>
);
