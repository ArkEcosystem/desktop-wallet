import React from "react";

import { Notifications } from "./Notifications";

export default {
	title: "Navigation / Notifications",
};

export const Default = () => {
	const plugins = [
		{
			logoUrl: "/static/media/ark-logo.bafd72bb.png",
			logoClassName: "flex p-2 mr-4 rounded-lg bg-logo",
			title: "ARK Explorer",
			description: "- update v2.5.6",
			action: {
				label: "Update now",
				value: "update",
			},
		},
	];

	const transactions = [
		{
			date: "17 Mar 2020 22:02:10",
			avatarId: "test",
			type: "receive",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			amount: "100 BTC",
			fiat: "1,000,000 USD",
		},
	];

	return (
		<div>
			<Notifications
				pluginsHeader="Plugin 17 Feb, 2020"
				plugins={plugins}
				transactionsHeader="Transactions 17 Feb, 2020"
				transactions={transactions}
				onAction={console.log}
			></Notifications>
		</div>
	);
};
