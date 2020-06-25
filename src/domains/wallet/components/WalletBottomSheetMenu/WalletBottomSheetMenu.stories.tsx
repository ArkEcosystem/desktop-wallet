import React from "react";

import { WalletBottomSheetMenu } from "./WalletBottomSheetMenu";

export default { title: "Wallets / Components / WalletBottomSheetMenu" };

const data = [
	{
		coinIcon: "Ark",
		coinClassName: "text-theme-danger-400 border-theme-danger-200",
		avatarId: "test1",
		address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		walletName: "ARK Wallet 1",
		balance: "120 ARK",
		fiat: "980 USD",
		walletTypeIcons: ["Multisig", "Ledger"],
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
		coinIcon: "Ark",
		coinClassName: "text-theme-danger-400 border-theme-danger-200",
		avatarId: "test2",
		address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		walletName: "ARK Wallet 2",
		balance: "20 ARK",
		fiat: "480 USD",
		walletTypeIcons: ["Star", "Ledger"],
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
		coinIcon: "Bitcoin",
		coinClassName: "text-theme-warning-400 border-theme-warning-200",
		avatarId: "test3",
		address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		walletName: "BTC Wallet 1",
		balance: "100 BTC",
		fiat: "1,000,000 USD",
		walletTypeIcons: ["Star", "Multisig", "Ledger"],
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

export const Default = () => {
	return (
		<div className="relative" style={{ height: "calc(100vh - 1.25rem)" }}>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod ab nobis dolor aperiam consectetur, eius
				velit autem, error quam magnam adipisci laboriosam sapiente ratione illo possimus dignissimos quo
				accusantium laborum.
			</p>
			<WalletBottomSheetMenu walletsData={data} />
		</div>
	);
};
