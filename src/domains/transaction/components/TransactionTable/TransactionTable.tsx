import { Table } from "app/components/Table";
import i18n from "i18next";
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
	onRowClick?: (row: Transaction) => void;
};

const commonColumns = [
	{
		Header: i18n.t("COMMON.ID"),
	},
	{
		Header: i18n.t("COMMON.DATE"),
		accessor: "timestamp",
	},
	{
		Header: i18n.t("COMMON.TYPE"),
		className: "invisible",
	},
	{
		Header: i18n.t("COMMON.RECIPIENT"),
	},
	{
		Header: i18n.t("COMMON.INFO"),
	},
	{
		Header: i18n.t("COMMON.STATUS"),
		className: "justify-center",
	},
	{
		Header: i18n.t("COMMON.AMOUNT"),
		className: "justify-end",
		accessor: "amount",
	},
];

export const TransactionTable = ({
	transactions,
	currencyRate,
	showSignColumn,
	hideHeader,
	isCompact,
	onRowClick,
}: Props) => {
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
		<Table hideHeader={hideHeader} columns={columns} data={transactions}>
			{(row: Transaction) =>
				isCompact ? (
					<TransactionCompactRow onClick={() => onRowClick?.(row)} transaction={row} />
				) : (
					<TransactionRow onClick={() => onRowClick?.(row)} transaction={row} currencyRate={currencyRate} />
				)
			}
		</Table>
	);
};

TransactionTable.defaultProps = {
	showSignColumn: false,
	isCompact: false,
	hideHeader: false,
};
