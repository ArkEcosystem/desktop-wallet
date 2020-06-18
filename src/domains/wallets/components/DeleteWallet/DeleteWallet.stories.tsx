import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { DeleteWallet } from "./DeleteWallet";

export default {
	title: "Wallets / Components / DeleteWallet",
	decorators: [withKnobs],
};

export const Default = () => (
	<DeleteWallet
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
		onDelete={() => alert("deleted")}
	/>
);
