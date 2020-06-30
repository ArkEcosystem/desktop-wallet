import { NavigationBar } from "app/components/NavigationBar";
import React from "react";

import { balances, networks, portfolioPercentages, transactions, wallets } from "../../data";
import { Dashboard } from "./Dashboard";

const notifications = {
	pluginsHeader: "Plugin Jun 16, 2020",
	plugins: [
		{
			logoClassName: "w-8 h-8 p-2 mr-4 rounded-lg bg-logo",
			title: "ARK Explorer",
			description: "- update v2.5.6",
			action: {
				label: "Update now",
				value: "update",
			},
		},
	],
	transactionsHeader: "Transaction Jun 16, 2020",
	transactions: [
		{
			date: "17 Mar 2020 22:02:10",
			avatarId: "test",
			type: "send",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			amount: "100 BTC",
			fiat: "1,000,000 USD",
		},
		{
			date: "17 Mar 2020 22:02:10",
			avatarId: "test",
			type: "receive",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			amount: "100 BTC",
			fiat: "1,000,000 USD",
		},
	],
};

export default { title: "Domains / Dashboard / Pages / Dashboard" };

export const Default = () => {
	return (
		<div className="bg-theme-neutral-100 pt-1 -m-5 -mt-6">
			<NavigationBar
				currencyIcon="Ark"
				balance="34,253.75"
				userInitials="IO"
				onUserAction={(action: any) => alert(action.label)}
				notifications={notifications}
				onNotificationAction={(actionName: string, actionData: any) => alert(actionName)}
			/>
			<Dashboard
				balances={balances}
				networks={networks}
				wallets={wallets}
				transactions={transactions}
				portfolioPercentages={portfolioPercentages}
			/>
		</div>
	);
};

export const FewerWallets = () => {
	return (
		<div className="bg-theme-neutral-100 pt-1 -m-5 -mt-6">
			<NavigationBar
				currencyIcon="Ark"
				balance="34,253.75"
				userInitials="IO"
				onUserAction={(action: any) => alert(action.label)}
				notifications={notifications}
				onNotificationAction={(actionName: string, actionData: any) => alert(actionName)}
			/>
			<Dashboard
				balances={balances}
				networks={networks}
				wallets={wallets.concat().splice(0, 2)}
				transactions={transactions}
				portfolioPercentages={portfolioPercentages}
			/>
		</div>
	);
};

export const Empty = () => {
	return (
		<div className="bg-theme-neutral-100 pt-1 -m-5 -mt-6">
			<NavigationBar
				currencyIcon="Ark"
				balance="34,253.75"
				userInitials="IO"
				onUserAction={(action: any) => alert(action.label)}
				notifications={notifications}
				onNotificationAction={(actionName: string, actionData: any) => alert(actionName)}
			/>
			<Dashboard networks={networks} portfolioPercentages={portfolioPercentages} />
		</div>
	);
};
