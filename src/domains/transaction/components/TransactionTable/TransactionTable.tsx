import { Table } from "app/components/Table";
import React from "react";

import { TransactionCompactRow } from "./TransactionRow/TransactionCompactRow";
import { TransactionRow } from "./TransactionRow/TransactionRow";
import { Transaction } from "./TransactionTable.models";

type Props = {
	transactions: Transaction[];
	currencyRate?: string;
	showSignColumn?: boolean;
	hideHeader?: boolean;
	isCompact?: boolean;
};

const commonColumns = [
	{
		Header: "ID",
	},
	{
		Header: "Date",
		accessor: "timestamp",
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
	},
	{
		Header: "Status",
		className: "justify-center",
	},
	{
		Header: "Amount",
		className: "justify-end",
		accessor: "amount",
	},
];

export const TransactionTable = ({ transactions, currencyRate, showSignColumn, hideHeader, isCompact }: Props) => {
	const columns = React.useMemo(() => {
		if (isCompact) {
			return [
				{
					Header: "Type",
					className: "invisible",
				},
				{
					Header: "Recipient",
				},
				{
					Header: "Amount",
					className: "justify-end",
					accessor: "amount",
				},
			];
		}

		if (currencyRate) {
			return [...commonColumns, { Header: "Currency", className: "justify-end" }];
		}

		if (showSignColumn) {
			return [...commonColumns, { Header: "Sign", className: "invisible" }];
		}

		return commonColumns;
	}, [currencyRate, showSignColumn, isCompact]);

	return (
		<Table hideColumns={hideHeader} columns={columns} data={transactions}>
			{(row: Transaction) =>
				isCompact ? (
					<TransactionCompactRow transaction={row} />
				) : (
					<TransactionRow transaction={row} currencyRate={currencyRate} />
				)
			}
		</Table>
	);
};

TransactionTable.defaultProps = {
	showSignColumn: false,
	isCompact: false,
	hideColumns: false,
};
