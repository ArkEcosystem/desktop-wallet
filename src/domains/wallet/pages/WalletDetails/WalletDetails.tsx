import { NavigationBar } from "app/components/NavigationBar";
import { NavigationHeader } from "app/components/NavigationHeader";
import { Table } from "app/components/Table";
import { TransactionListItem } from "app/components/TransactionListItem";
import { WalletBottomSheetMenu } from "domains/wallet/components/WalletBottomSheetMenu";
import { WalletHeader } from "domains/wallet/components/WalletHeader/WalletHeader";
import { WalletRegistrations } from "domains/wallet/components/WalletRegistrations";
import { WalletVote } from "domains/wallet/components/WalletVote";
import React from "react";

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

export const WalletDetails = () => {
	return (
		<div className="relative">
			<NavigationBar />
			<NavigationHeader title="Go back to portofolio" />
			<WalletHeader coin="Ark" address="abc" balance="0.1" />
			<WalletVote delegates={[{ username: "ROBank", rank: 1, address: "bca" }]} />
			<WalletRegistrations address="abc" isMultisig hasSecondSignature hasPlugins />
			<WalletBottomSheetMenu walletsData={[]} />
			<div className="px-12 py-8">
				<h2 className="font-bold">Pending Transactions</h2>
				<Table columns={columns} data={transactions}>
					{(rowData: any) => <TransactionListItem {...rowData} />}
				</Table>
			</div>
			<div className="px-12 pt-4 pb-20">
				<h2 className="font-bold">Transaction History</h2>
				<Table columns={columns} data={transactions}>
					{(rowData: any) => <TransactionListItem {...rowData} />}
				</Table>
			</div>
		</div>
	);
};
