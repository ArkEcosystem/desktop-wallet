import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TransactionCompactRow } from "./TransactionRow/TransactionCompactRow";
import { TransactionRow } from "./TransactionRow/TransactionRow";

type Props = {
	transactions: ExtendedTransactionData[];
	currencyRate?: string;
	showSignColumn?: boolean;
	hideHeader?: boolean;
	isCompact?: boolean;
	onRowClick?: (row: ExtendedTransactionData) => void;
	isLoading?: boolean;
	skeletonRowsLimit?: number;
};

export const TransactionTable = ({
	transactions,
	currencyRate,
	showSignColumn,
	hideHeader,
	isCompact,
	onRowClick,
	isLoading,
	skeletonRowsLimit,
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

	const columns = useMemo(() => {
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
			return [...commonColumns, { Header: t("COMMON.CURRENCY"), className: "w-24 justify-end float-right" }];
		}

		if (showSignColumn) {
			return [...commonColumns, { Header: t("COMMON.SIGN"), className: "invisible w-24" }];
		}

		return commonColumns;
	}, [commonColumns, currencyRate, showSignColumn, isCompact, t]);

	const showSkeleton = useMemo(() => isLoading && transactions.length === 0, [transactions, isLoading]);

	const skeletonRows = new Array(skeletonRowsLimit).fill({});
	const data = showSkeleton ? skeletonRows : transactions;

	return (
		<div className="relative">
			<Table hideHeader={hideHeader} columns={columns} data={data}>
				{(row: ExtendedTransactionData) =>
					isCompact ? (
						<TransactionCompactRow onClick={() => onRowClick?.(row)} transaction={row} />
					) : (
						<TransactionRow
							isLoading={showSkeleton}
							onClick={() => onRowClick?.(row)}
							transaction={row}
							currencyRate={currencyRate}
							showSign={showSignColumn}
							isSignaturePending={row.isMultiSignature && showSignColumn}
						/>
					)
				}
			</Table>
		</div>
	);
};

TransactionTable.defaultProps = {
	showSignColumn: false,
	isCompact: false,
	hideHeader: false,
	isLoading: false,
	skeletonRowsLimit: 8,
};
