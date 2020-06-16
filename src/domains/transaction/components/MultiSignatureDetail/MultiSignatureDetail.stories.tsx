import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { MultiSignatureDetail } from "./";

export default { title: "Transaction / Components / MultiSignature Detail" };

export const Default = () => (
	<MultiSignatureDetail
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
	/>
);
