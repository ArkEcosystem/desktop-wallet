import { boolean } from "@storybook/addon-knobs";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";

import { SecondSignatureDetail } from "./SecondSignatureDetail";

export default { title: "Domains / Transaction / Components / SecondSignatureDetail" };

export const Default = () => (
	<SecondSignatureDetail
		isOpen={boolean("Is Open", true)}
		transaction={{ ...TransactionFixture, blockId: () => "adsad12312xsd1w312e1s13203e12" }}
    wallet={TransactionFixture.wallet()}
		onClose={() => alert("closed")}
	/>
);
