import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { DevelopmentNetwork } from "./DevelopmentNetwork";

export default { title: "Domains / Setting / Components / DevelopmentNetwork" };

export const Default = () => (
	<DevelopmentNetwork
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("canceled")}
		onContinue={() => alert("continue")}
	/>
);
