import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { VerifyMessage } from "./VerifyMessage";

export default {
	title: "Wallets / Components / Verify Message",
	decorators: [withKnobs],
};

export const Default = () => {
	return (
		<VerifyMessage
			isOpen={boolean("isOpen", true)}
			handleClose={() => alert("closed")}
			publicKey="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWKAUexKjGtgsSpVzPLs6jNMM"
		/>
	);
};
