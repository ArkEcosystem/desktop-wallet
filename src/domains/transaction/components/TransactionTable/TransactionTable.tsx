import { Table } from "app/components/Table";
import React from "react";

import { TransactionRow } from "./TransactionRow/TransactionRow";
import { Transaction } from "./TransactionTable.models";

type Props = {
	transactions: Transaction[];
	currencyRate?: string;
	showSignColumn?: boolean;
};

const commonColumns = [
	{
		Header: "ID",
	},
	{
		Header: "Date",
	},
	{
		Header: "Type",
		className: "invisible",
	},
	{
		Header: "Recipient",
	},
	{
		Header: "Info",
		className: "justify-center",
	},
	{
		Header: "Status",
		className: "justify-center",
	},
	{
		Header: "Amount",
		className: "justify-end",
	},
];

export const TransactionTable = ({ transactions, currencyRate, showSignColumn }: Props) => {
	const columns = React.useMemo(() => {
		if (currencyRate) {
			return [...commonColumns, { Header: "Currency", className: "justify-end" }];
		}

		if (showSignColumn) {
			return [...commonColumns, { Header: "Sign", className: "invisible" }];
		}

		return commonColumns;
	}, [currencyRate, showSignColumn]);

	return (
		<Table columns={columns} data={transactions}>
			{(row: Transaction) => <TransactionRow transaction={row} currencyRate={currencyRate} />}
		</Table>
	);
};
