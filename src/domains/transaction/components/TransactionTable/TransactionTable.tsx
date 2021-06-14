import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TransactionCompactRow } from "./TransactionRow/TransactionCompactRow";
import { TransactionRow } from "./TransactionRow/TransactionRow";

interface Props {
	transactions: DTO.ExtendedTransactionData[];
	exchangeCurrency?: string;
	showSignColumn?: boolean;
	showExplorerLinkColumn?: boolean;
	hideHeader?: boolean;
	isCompact?: boolean;
	onRowClick?: (row: DTO.ExtendedTransactionData) => void;
	isLoading?: boolean;
	skeletonRowsLimit?: number;
}

export const TransactionTable = memo(
	({
		transactions,
		exchangeCurrency,
		showSignColumn = false,
		showExplorerLinkColumn = true,
		isCompact = false,
		hideHeader = false,
		isLoading = false,
		skeletonRowsLimit = 8,
		onRowClick,
	}: Props) => {
		const { t } = useTranslation();

		const initialState = {
			sortBy: [
				{
					id: "date",
					desc: true,
				},
			],
		};

		const columns = useMemo(() => {
			const commonColumns: any = [
				{
					Header: t("COMMON.DATE"),
					id: "date",
					accessor: (transaction: DTO.ExtendedTransactionData) => transaction.timestamp?.()?.toUNIX(),
					sortDescFirst: true,
					cellWidth: "w-50",
				},
				{
					Header: t("COMMON.RECIPIENT"),
					cellWidth: "w-20",
				},
				{
					Header: t("COMMON.INFO"),
					className: "justify-center",
				},
				{
					Header: t("COMMON.STATUS"),
					className: "justify-center",
					minimumWidth: true,
				},
				{
					Header: t("COMMON.AMOUNT"),
					id: "amount",
					accessor: (transaction: DTO.ExtendedTransactionData) => transaction.total?.().toHuman(),
					sortDescFirst: true,
					className: "justify-end",
				},
			];

			if (isCompact) {
				return [
					{
						Header: t("COMMON.RECIPIENT"),
					},
					{
						Header: t("COMMON.AMOUNT"),
						id: "amount",
						accessor: (transaction: DTO.ExtendedTransactionData) => transaction.total?.().toHuman(),
						className: "justify-end",
					},
				];
			}

			if (showExplorerLinkColumn) {
				commonColumns.unshift({
					Header: t("COMMON.ID"),
					minimumWidth: true,
				});
			}

			if (exchangeCurrency) {
				return [
					...commonColumns,
					{ Header: t("COMMON.CURRENCY"), className: "justify-end float-right", cellWidth: "w-24" },
				];
			}

			if (showSignColumn) {
				return [...commonColumns, { Header: "Sign", className: "invisible", cellWidth: "w-24" }];
			}

			return commonColumns;
		}, [exchangeCurrency, showExplorerLinkColumn, showSignColumn, isCompact, t]);

		const showSkeleton = useMemo(() => isLoading && transactions.length === 0, [transactions, isLoading]);

		const data = useMemo(() => {
			const skeletonRows = new Array(skeletonRowsLimit).fill({});
			return showSkeleton ? skeletonRows : transactions;
		}, [showSkeleton, transactions, skeletonRowsLimit]);

		return (
			<div data-testid="TransactionTable" className="relative">
				<Table hideHeader={hideHeader} columns={columns} data={data} initialState={initialState}>
					{(row: DTO.ExtendedTransactionData) =>
						isCompact ? (
							<TransactionCompactRow onClick={() => onRowClick?.(row)} transaction={row} />
						) : (
							<TransactionRow
								isLoading={showSkeleton}
								onClick={() => onRowClick?.(row)}
								transaction={row}
								exchangeCurrency={exchangeCurrency}
								showExplorerLink={showExplorerLinkColumn}
								showSignColumn={showSignColumn}
								isSignaturePending={row.isMultiSignatureRegistration() && showSignColumn}
							/>
						)
					}
				</Table>
			</div>
		);
	},
);

TransactionTable.displayName = "TransactionTable";
