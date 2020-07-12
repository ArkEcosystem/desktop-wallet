import React from "react";

import { NavigationBar } from "./NavigationBar";

export default { title: "App / Components / NavigationBar" };

export const Default = () => {
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
				id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
				confirmations: "100",
				timestamp: "17 Mar 2020 10:22:05",
				type: "secondSignature",
				sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
				recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
				amount: "0",
				fee: "0.1",
				isSent: true,
			},
			{
				id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
				confirmations: "100",
				timestamp: "17 Mar 2020 10:22:05",
				type: "vote",
				sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
				recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
				amount: "0",
				fee: "0.1",
				isSent: true,
			},
		],
	};

	return (
		<div className="-m-5">
			<NavigationBar
				currencyIcon="Ark"
				balance="34,253.75"
				userInitials="IO"
				onUserAction={(action: any) => alert(action.label)}
				notifications={notifications}
				onNotificationAction={(actionName: string, actionData: any) => alert(actionName)}
			/>
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
		</div>
	);
};

export const EmptyNotifications = () => {
	const notifications = {
		pluginsHeader: "Plugin Jun 16, 2020",
		transactionsHeader: "Transaction Jun 16, 2020",
	};

	return (
		<div className="-m-5">
			<NavigationBar
				currencyIcon="Ark"
				balance="34,253.75"
				userInitials="IO"
				onUserAction={(action: any) => alert(action.label)}
				notifications={notifications}
				onNotificationAction={(actionName: string, actionData: any) => alert(actionName)}
			/>
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
			<div className="h-64 border-b" />
		</div>
	);
};
