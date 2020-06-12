import React from "react";
import { boolean } from "@storybook/addon-knobs";
import { WalletUpdate } from "./";

export default { title: "Wallets / Components / Wallet Update" };

export const Default = () => (
	<WalletUpdate
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
		onUpdate={() => alert("updated")}
	/>
);
