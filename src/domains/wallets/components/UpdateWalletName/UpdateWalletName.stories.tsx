import React from "react";
import { UpdateWalletName } from "./";
import { Button } from "app/components/Button";
import { withKnobs, boolean, text } from "@storybook/addon-knobs";

export default {
	title: "Wallets / Components / UpdateWalletName",
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
