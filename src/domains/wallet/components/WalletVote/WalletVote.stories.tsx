import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
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

export const Default = ({ delegates }: { delegates: ReadOnlyWallet[] }) => (
	<WalletVote votes={delegates} onUnvote={action("onUnvote")} />
);

export const Empty = () => <WalletVote onUnvote={action("onUnvote")} />;
