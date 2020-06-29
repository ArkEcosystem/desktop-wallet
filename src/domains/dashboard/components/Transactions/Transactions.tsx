import { Button } from "app/components/Button";
import { Table } from "app/components/Table";
import { TransactionListItem } from "app/components/TransactionListItem";
import React from "react";

type TransactionsProps = {
	title: string;
	columns: any;
	transactions?: any;
	emptyText?: string;
};

export const Transactions = ({ transactions, columns, title, emptyText }: TransactionsProps) => {
	return (
		<div className="bg-white">
			<div className="text-4xl font-bold">{title}</div>
			{transactions.length > 0 && (
				<div className="pt-8">
					<Table columns={columns} data={transactions}>
						{(rowData: any) => <TransactionListItem {...rowData} />}
					</Table>

					<Button variant="plain" className="w-full mt-10 mb-5">
						See more
					</Button>
				</div>
			)}
			{transactions.length === 0 && <div className="text-theme-neutral-700">{emptyText}</div>}
		</div>
	);
};

Transactions.defaultProps = {
	title: "Transactions History",
	emptyText:
		"This will display the history of your transactions. But you don't have more than one transaction at the moment.",
	columns: [
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
			Header: "Info",
			className: "justify-center",
		},
		{
			Header: "Amount",
			className: "float-right",
		},
		{
			Header: "Fiat Value",
			className: "float-right",
		},
	],
	transactions: [],
};
