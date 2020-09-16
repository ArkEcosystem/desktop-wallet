import { action } from "@storybook/addon-actions";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { ReceiveFunds } from "./ReceiveFunds";

export default {
	title: "Domains / Wallet / Components / ReceiveFunds",
	decorators: [withKnobs],
};

export const Default = () => (
	<ReceiveFunds
		address="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
		name="My Wallet"
		icon="ARK"
		isOpen={boolean("isOpen", true)}
		handleClose={action("handleClose")}
	/>
);

export const WithoutName = () => (
	<ReceiveFunds
		address="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
		icon="ARK"
		isOpen={boolean("isOpen", true)}
		handleClose={action("handleClose")}
	/>
);
