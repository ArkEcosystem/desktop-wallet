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
		icon="ARK"
		name="My Wallet"
		network="ark.devnet"
		isOpen={boolean("isOpen", true)}
		onClose={action("onClose")}
	/>
);

export const WithoutName = () => (
	<ReceiveFunds
		address="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
		icon="ARK"
		network="ark.devnet"
		isOpen={boolean("isOpen", true)}
		onClose={action("onClose")}
	/>
);
