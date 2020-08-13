import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { WalletUpdate } from "./WalletUpdate";

export default { title: "Domains / Wallet / Components / WalletUpdate" };

export const Default = () => (
	<WalletUpdate
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
	/>
);
