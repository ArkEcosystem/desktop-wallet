import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { action } from "@storybook/addon-actions";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { SearchWallet } from "./SearchWallet";

export default {
	title: "Domains / Wallet / Components / SearchWallet",
	decorators: [withKnobs],
};

export const Default = () => (
	<WalletsDecorator count={3}>
		{({ wallets }: { wallets: ReadWriteWallet[] }) => (
			<SearchWallet
				isOpen={boolean("isOpen", true)}
				title="Select Account"
				wallets={wallets}
				onClose={action("onClose")}
			/>
		)}
	</WalletsDecorator>
);

export const Empty = () => (
	<SearchWallet isOpen={boolean("isOpen", true)} title="Select Account" wallets={[]} onClose={action("onClose")} />
);
