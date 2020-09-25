import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { SecondSignatureDetail } from "./SecondSignatureDetail";

export default { title: "Domains / Transaction / Components / SecondSignatureDetail" };

export const Default = () => (
	<SecondSignatureDetail isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />
);
