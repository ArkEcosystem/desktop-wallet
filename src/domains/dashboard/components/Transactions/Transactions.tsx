import React, { useState } from "react";

import { Table } from "app/components/Table";
import { TransactionListItem } from "app/components/TransactionListItem";
import { Button } from "app/components/Button";

type TransactionsProps = {
	title: string;
	columns: any;
	transactions?: any;
};

export const Transactions = ({ transactions, columns, title }: TransactionsProps) => {
	return (
		<div className="bg-theme-background mt-10 p-10">
			<h2 className="pb-4">{title}</h2>
			<Table columns={columns} data={transactions}>
				{(rowData: any) => <TransactionListItem {...rowData}></TransactionListItem>}
			</Table>

			<Button color="primary" variant="plain" className="w-full mt-10 mb-5">
				See more
			</Button>
		</div>
	);
};

Transactions.defaultProps = {
	title: "Transactions History",
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
			Header: "Amount",
			className: "float-right",
		},
		{
			Header: "Fiat Value",
			className: "float-right",
		},
	],
};
