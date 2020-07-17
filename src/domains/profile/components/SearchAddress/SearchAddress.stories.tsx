import { action } from "@storybook/addon-actions";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { wallets } from "domains/wallet/data";
import React from "react";

import { SearchAddress } from "./SearchAddress";
export default {
	title: "Domains / Profile / Components / SearchAddress",
	decorators: [withKnobs],
};

export const Default = () => {
	return (
		<div>
			<SearchAddress
				isOpen={boolean("isOpen", true)}
				wallets={wallets}
				onClose={action("onClose")}
				onAction={console.log}
			/>
		</div>
	);
};
