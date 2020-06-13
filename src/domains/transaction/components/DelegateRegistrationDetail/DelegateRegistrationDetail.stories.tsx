import React from "react";
import { DelegateRegistrationDetail } from "./";
import { boolean } from "@storybook/addon-knobs";

export default { title: "Transaction / Components / Delegate Registration Detail" };

export const Default = () => (
	<DelegateRegistrationDetail isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />
);
