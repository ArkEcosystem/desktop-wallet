import { action } from "@storybook/addon-actions";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { wallets } from "../../data";
import { SearchWallet } from "./SearchWallet";

export default {
	title: "Domains / Wallet / Components / SearchWallet",
	decorators: [withKnobs],
};

export const Default = () => {
	const networks = [
		{
			name: "Ark",
			isSelected: true,
		},
		{
			name: "Ethereum",
			isSelected: false,
		},
		{
			name: "Bitcoin",
			isSelected: true,
		},
	];

	return (
		<SearchWallet
			isOpen={boolean("isOpen", true)}
			wallets={wallets}
			networks={networks}
			onClose={action("onClose")}
			onSearch={action("onSearch")}
		/>
	);
};
