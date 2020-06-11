import React from "react";
import { DeleteWallet } from "./";
import { withKnobs, boolean } from "@storybook/addon-knobs";

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
