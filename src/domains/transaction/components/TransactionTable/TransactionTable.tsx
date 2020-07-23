import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

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

export const TransactionTable = ({
	transactions,
	currencyRate,
	showSignColumn,
	hideHeader,
	isCompact,
	onRowClick,
}: Props) => {
	const { t } = useTranslation();

	const commonColumns = [
		{
			Header: t("COMMON.ID"),
		},
		{
			Header: t("COMMON.DATE"),
			accessor: "timestamp",
		},
		{
			Header: t("COMMON.TYPE"),
			className: "invisible",
		},
		{
			Header: t("COMMON.RECIPIENT"),
		},
		{
			Header: t("COMMON.INFO"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.STATUS"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.AMOUNT"),
			className: "justify-end",
			accessor: "amount",
		},
	];

	const columns = React.useMemo(() => {
		if (isCompact) {
			return [
				{
					Header: t("COMMON.TYPE"),
					className: "invisible",
				},
				{
					Header: t("COMMON.RECIPIENT"),
				},
				{
					Header: t("COMMON.AMOUNT"),
					accessor: "amount",
					className: "justify-end",
				},
			];
		}

		if (currencyRate) {
			return [...commonColumns, { Header: t("COMMON.CURRENCY"), className: "justify-end" }];
		}

		if (showSignColumn) {
			return [...commonColumns, { Header: t("COMMON.SIGN"), className: "invisible" }];
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
