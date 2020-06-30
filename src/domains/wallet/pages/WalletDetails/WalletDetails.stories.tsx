import React from "react";

import { WalletDetails } from "./WalletDetails";

export default { title: "Wallets / Pages / WalletDetails" };

const wallets = [
	{
		coinIcon: "Ark",
		coinClassName: "text-theme-danger-400 border-theme-danger-200",
		avatarId: "test1",
		address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		publicKey: "028fe98e42e159f2450a52371dfb23ae69a39fc5fee6545690b7f51bfcee933357",
		walletName: "ARK Wallet 1",
		balance: "120 ARK",
		fiat: "980 USD",
		walletTypeIcons: ["Multisig", "Ledger", "Key", "Bridgechain"],
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
		delegates: [
			{
				username: "Delegate 3",
				address: "AbuzhuDTyhnfAqepZzVcVsgd1Ym6FgETuW",
				rank: 1,
				explorerUrl: "https://dexplorer.ark.io",
				msqUrl: "https://marketsquare.ark.io",
				isActive: true,
			},
		],
		business: {
			name: "ROBank Eco",
		},
		pendingTransactions: [
			{
				date: "17 Mar 2020 22:02:10",
				avatarId: "test",
				type: "receive",
				address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
				walletName: "My Wallet",
				amount: "100 ARK",
				fiat: "1,000,000 USD",
			},
			{
				date: "17 Mar 2020 22:02:10",
				avatarId: "test",
				type: "send",
				address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
				walletName: "My Wallet",
				amount: "- 100 ARK",
				fiat: "1,000,000 USD",
			},
		],
		transactions: [
			{
				date: "17 Mar 2020 22:02:10",
				avatarId: "test",
				type: "send",
				address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
				walletName: "My Wallet",
				amount: "- 100 ARK",
				fiat: "1,000,000 USD",
			},
		],
		hasStarred: true,
	},
];

const wallet = wallets[0];

export const Default = () => <WalletDetails wallets={wallets} wallet={wallet} />;
