import React from "react";
import { UpdateWalletName } from "./";
import { withKnobs, boolean } from "@storybook/addon-knobs";

export default {
	title: "Modals / Update Wallet Name",
	decorators: [withKnobs],
};

export const Default = () => (
	<UpdateWalletName
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
		onSave={() => alert("saved")}
	/>
);
