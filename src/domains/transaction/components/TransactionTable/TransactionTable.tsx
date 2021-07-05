import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TransactionCompactRow } from "./TransactionRow/TransactionCompactRow";
import { TransactionRow } from "./TransactionRow/TransactionRow";

type Skeleton = object;

interface Properties {
	transactions: DTO.ExtendedConfirmedTransactionData[];
	exchangeCurrency?: string;
	showSignColumn?: boolean;
	showExplorerLinkColumn?: boolean;
	hideHeader?: boolean;
	isCompact?: boolean;
	onRowClick?: (row: DTO.ExtendedConfirmedTransactionData) => void;
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
	}: Properties) => {
		const { t } = useTranslation();

		const initialState = {
			sortBy: [
				{
					desc: true,
					id: "date",
				},
			],
		};

		const columns = useMemo(() => {
			const commonColumns: any = [
				{
					Header: t("COMMON.DATE"),
					accessor: (transaction: DTO.ExtendedConfirmedTransactionData) =>
						transaction.timestamp?.()?.toUNIX(),
					cellWidth: "w-50",
					id: "date",
					sortDescFirst: true,
				},
				{
					Header: t("COMMON.RECIPIENT"),
					cellWidth: "w-96",
				},
				{
					Header: t("COMMON.INFO"),
					cellWidth: "w-24",
					className: "justify-center",
				},
				{
					Header: t("COMMON.STATUS"),
					cellWidth: "w-20",
					className: "justify-center",
				},
				{
					Header: t("COMMON.AMOUNT"),
					accessor: (transaction: DTO.ExtendedConfirmedTransactionData) => transaction.total?.(),
					className: "justify-end",
					id: "amount",
					sortDescFirst: true,
				},
			];

			if (isCompact) {
				return [
					{
						Header: t("COMMON.RECIPIENT"),
					},
					{
						Header: t("COMMON.AMOUNT"),
						accessor: (transaction: DTO.ExtendedConfirmedTransactionData) => transaction.total?.(),
						className: "justify-end",
						id: "amount",
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
					{ Header: t("COMMON.CURRENCY"), cellWidth: "w-24", className: "justify-end float-right" },
				];
			}

			if (showSignColumn) {
				return [...commonColumns, { Header: "Sign", cellWidth: "w-24", className: "invisible" }];
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
					{(row: DTO.ExtendedConfirmedTransactionData | Skeleton) =>
						isCompact ? (
							<TransactionCompactRow
								isLoading={showSkeleton}
								onClick={() => onRowClick?.(row as DTO.ExtendedConfirmedTransactionData)}
								transaction={row as DTO.ExtendedConfirmedTransactionData}
							/>
						) : (
							<TransactionRow
								isLoading={showSkeleton}
								onClick={() => onRowClick?.(row as DTO.ExtendedConfirmedTransactionData)}
								transaction={row as DTO.ExtendedConfirmedTransactionData}
								exchangeCurrency={exchangeCurrency}
								showExplorerLink={showExplorerLinkColumn}
								showSignColumn={showSignColumn}
							/>
						)
					}
				</Table>
			</div>
		);
	},
);

TransactionTable.displayName = "TransactionTable";
