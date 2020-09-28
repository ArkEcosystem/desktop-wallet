import { boolean } from "@storybook/addon-knobs";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";

import { EntityDetail } from "./EntityDetail";

export default { title: "Domains / Transaction / Components / EntityDetail" };

export const Default = () => (
	<EntityDetail
		isOpen={boolean("Is Open", true)}
		transaction={{ ...TransactionFixture, blockId: () => "adsad12312xsd1w312e1s13203e12" }}
		onClose={() => alert("closed")}
	/>
);
