import { action } from "@storybook/addon-actions";
import React from "react";

import { WalletVote } from "./WalletVote";

export default { title: "Domains / Wallet / Components / WalletVote" };

const data = [
	{
		username: "Test",
		address: "abc",
		rank: 1,
		explorerUrl: "https://dexplorer.ark.io",
		msqUrl: "https://marketsquare.ark.io",
		isActive: true,
	},
];

export const Default = () => <WalletVote delegates={data} onUnvote={action("onUnvote")} />;

export const Empty = () => <WalletVote delegates={[]} onUnvote={action("onUnvote")} />;
