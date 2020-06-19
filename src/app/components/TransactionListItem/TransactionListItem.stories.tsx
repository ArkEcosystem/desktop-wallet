import { Table } from "app/components/Table";
import React from "react";

import { TransactionListItem } from "./TransactionListItem";

export default {
	title: "Transactions / Components / TransactionListItem",
};

const data = [
	{
		date: "17 Mar 2020 22:02:10",
		avatarId: "test",
		type: "receive",
		address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		walletName: "My Wallet",
		amount: "100 BTC",
		fiat: "1,000,000 USD",
	},
	{
		date: "17 Mar 2020 22:02:10",
		avatarId: "test",
		type: "send",
		address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		walletName: "My Wallet",
		amount: "- 100 BTC",
		fiat: "1,000,000 USD",
	},
];

export const Default = () => {
	const columns = [
		{
			Header: "Date",
		},
		{
			Header: "Type",
			className: "invisible",
		},
		{
			Header: "Wallet Address",
		},
		{
			Header: "Amount",
			className: "float-right",
		},
		{
			Header: "Fiat Value",
			className: "float-right",
		},
	];

	return (
		<div>
			<div>
				<Table columns={columns} data={data}>
					{(rowData: any) => <TransactionListItem {...rowData} />}
				</Table>
			</div>
		</div>
	);
};

export const Compact = () => {
	const compactColumns = [
		{
			Header: "Type",
		},
		{
			Header: "Wallet Address",
		},
		{
			Header: "Amount",
			className: "float-right",
		},
	];

	return (
		<div>
			<div>
				<Table columns={compactColumns} data={data}>
					{(rowData: any) => <TransactionListItem variant="compact" {...rowData} />}
				</Table>
			</div>
		</div>
	);
};
