import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { WalletBottomSheetMenu } from "./WalletBottomSheetMenu";

export default {
	title: "Domains / Wallet / Components / WalletBottomSheetMenu",
	decorators: [(storyFn: any) => <WalletsDecorator count={3}>{storyFn}</WalletsDecorator>],
};

const data = [
	{
		wallet: (null as unknown) as ReadWriteWallet,
		coinClassName: "text-theme-danger-400 border-theme-danger-light",
		avatarId: "test1",
		actions: [
			{
				label: "Action 1",
				value: "1",
			},
			{
				label: "Action 2",
				value: "2",
			},
			{
				label: "Action 3",
				value: "3",
			},
		],
	},
	{
		wallet: (null as unknown) as ReadWriteWallet,
		coinClassName: "text-theme-danger-400 border-theme-danger-light",
		avatarId: "test2",
		actions: [
			{
				label: "Action 1",
				value: "1",
			},
			{
				label: "Action 2",
				value: "2",
			},
			{
				label: "Action 3",
				value: "3",
			},
		],
	},
	{
		wallet: (null as unknown) as ReadWriteWallet,
		coinClassName: "text-theme-warning-400 border-theme-warning-200",
		avatarId: "test3",
		actions: [
			{
				label: "Action 1",
				value: "1",
			},
			{
				label: "Action 2",
				value: "2",
			},
			{
				label: "Action 3",
				value: "3",
			},
		],
	},
];

export const Default = ({ wallets }: { wallets: ReadWriteWallet[] }) => {
	for (const walletIndex of Object.keys(data)) {
		data[walletIndex as any].wallet = wallets[walletIndex as any];
	}

	return (
		<div className="relative" style={{ height: "calc(100vh - 1.25rem)" }}>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod ab nobis dolor aperiam consectetur, eius
				velit autem, error quam magnam adipisci laboriosam sapiente ratione illo possimus dignissimos quo
				accusantium laborum.
			</p>
			<WalletBottomSheetMenu wallets={[]} />
		</div>
	);
};
