import React from "react";
import { MultiSignatureDetail } from "./";
import { boolean } from "@storybook/addon-knobs";

export default { title: "Transaction / Components / MultiSignature Detail" };

export const Default = () => (
	<MultiSignatureDetail
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onDelete={() => alert("deleted")}
	/>
);
