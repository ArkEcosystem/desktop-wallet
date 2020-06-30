import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { UpdateWalletName } from "./UpdateWalletName";

export default {
	title: "Domains / Wallet / Components / UpdateWalletName",
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
