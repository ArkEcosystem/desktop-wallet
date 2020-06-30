import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { AdvancedMode } from "./AdvancedMode";

export default { title: "Domains / Setting / Components / AdvancedMode" };

export const Default = () => (
	<AdvancedMode
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onAccept={() => alert("accepted")}
		onDecline={() => alert("declined")}
	/>
);
