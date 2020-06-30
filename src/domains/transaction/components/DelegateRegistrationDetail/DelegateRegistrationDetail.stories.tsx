import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { DelegateRegistrationDetail } from "./DelegateRegistrationDetail";

export default { title: "Domains / Transaction / Components / DelegateRegistrationDetail" };

export const Default = () => (
	<DelegateRegistrationDetail isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />
);
