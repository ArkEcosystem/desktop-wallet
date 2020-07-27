import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import { action } from "@storybook/addon-actions";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { SearchWallet } from "./SearchWallet";

export default {
	title: "Domains / Wallet / Components / SearchWallet",
	decorators: [withKnobs],
};

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

export const Default = () => {
	return (
		<WalletsDecorator count={3}>
			{({ wallets }: { wallets: Wallet[] }) => (
				<SearchWallet
					isOpen={boolean("isOpen", true)}
					wallets={wallets}
					networks={networks}
					onClose={action("onClose")}
					onSearch={action("onSearch")}
				/>
			)}
		</WalletsDecorator>
	);
};

export const Empty = () => {
	return (
		<SearchWallet
			isOpen={boolean("isOpen", true)}
			wallets={undefined}
			networks={networks}
			onClose={action("onClose")}
			onSearch={action("onSearch")}
		/>
	);
};
