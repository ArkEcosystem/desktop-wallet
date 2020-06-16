import { Table } from "app/components/Table";
import React from "react";

import { WalletListItem } from "./WalletListItem";

export default {
	title: "Wallets / Components / WalletListItem",
};

const data = [
	{
		coin: "Btc",
		coinClassName: "text-theme-warning-400 border-theme-warning-200",
		avatarId: "test",
		address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		walletName: "My Wallet",
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

const columns = [
	{
		Header: "Asset Type",
		accessor: "avatarId",
	},
	{
		Header: "Wallet Address",
		accessor: "address",
	},
	{
		Header: "Wallet Type",
	},
	{
		Header: "Balance",
		accessor: "balance",
		className: "float-right",
	},
	{
		Header: "Fiat Value",
		accessor: "fiat",
		className: "float-right",
	},
];

export const Default = () => {
	return (
		<div>
			<div>
				<Table columns={columns} data={data}>
					{(rowData: any) => <WalletListItem {...rowData} />}
				</Table>
			</div>
		</div>
	);
};

export const SingleAction = () => {
	return (
		<div>
			<div>
				<Table columns={columns} data={data}>
					{(rowData: any) => <WalletListItem {...rowData} variant="singleAction" />}
				</Table>
			</div>
		</div>
	);
};
