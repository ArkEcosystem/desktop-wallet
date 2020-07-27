import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { WalletDetails } from "./WalletDetails";

export default {
	title: "Domains / Wallet / Pages / WalletDetails",
	decorators: [
		(storyFn: any) => (
			<WalletsDecorator count={1} withDelegates={true}>
				{storyFn}
			</WalletsDecorator>
		),
	],
};

export const Default = ({ wallets }: { wallets: Wallet[] }) => (
	<WalletDetails wallets={[wallets[0]]} wallet={wallets[0]} />
);

export const Empty = () => <WalletDetails />;

export const MultipleWallets = ({ wallets }: { wallets: Wallet[] }) => (
	<WalletDetails wallets={wallets} wallet={wallets[0]} />
);
