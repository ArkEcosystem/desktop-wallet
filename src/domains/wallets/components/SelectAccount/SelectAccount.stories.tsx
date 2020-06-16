import { action } from "@storybook/addon-actions";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { wallets } from "../../data";
import { SelectAccount } from "./SelectAccount";

export default {
	title: "Wallets / Components / Select Account",
	decorators: [withKnobs],
};

export const Default = () => {
	return (
		<SelectAccount
			isOpen={boolean("isOpen", true)}
			wallets={wallets}
			handleClose={action("handleClose")}
			handleSelect={action("handleSelect")}
		/>
	);
};
