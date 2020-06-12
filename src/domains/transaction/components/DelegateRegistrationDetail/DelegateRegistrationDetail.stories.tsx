import React from "react";
import { DelegateDetail } from "./";
import { boolean } from "@storybook/addon-knobs";

export default { title: "Transaction / Components / Delegate Registration Detail" };

export const Default = () => (
	<DelegateDetail
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onDelete={() => alert("deleted")}
	/>
);
