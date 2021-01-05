import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { action } from "@storybook/addon-actions";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { WalletVote } from "./WalletVote";

export default {
	title: "Domains / Wallet / Components / WalletVote",
	decorators: [
		(storyFn: any) => (
			<WalletsDecorator count={1} withDelegates={true}>
				{storyFn}
			</WalletsDecorator>
		),
	],
};

export const Default = ({ delegates, wallets }: { delegates: ReadOnlyWallet[]; wallets: ReadWriteWallet[] }) => (
	<WalletVote wallet={wallets[0]} onButtonClick={action("onButtonClick")} />
);

export const Empty = ({ wallets }: { wallets: ReadWriteWallet[] }) => (
	<WalletVote
		wallet={{
			...wallets[0],
			votes: () => [],
		}}
		onButtonClick={action("onButtonClick")}
	/>
);

export const Loading = ({ wallets }: { wallets: ReadWriteWallet[] }) => (
	<WalletVote
		wallet={{
			...wallets[0],
			hasSyncedWithNetwork: () => false,
		}}
		onButtonClick={action("onButtonClick")}
	/>
);
