import { Contracts } from "@arkecosystem/platform-sdk";
import { Loader } from "app/components/Loader";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionCompactRow } from "./TransactionRow/TransactionCompactRow";
import { TransactionRow } from "./TransactionRow/TransactionRow";

type Props = {
	transactions: Contracts.TransactionDataType[];
	currencyRate?: string;
	showSignColumn?: boolean;
	hideHeader?: boolean;
	isCompact?: boolean;
	onRowClick?: (row: Contracts.TransactionDataType) => void;
	isLoading?: boolean;
};

export const TransactionTable = ({
	transactions,
	currencyRate,
	showSignColumn,
	hideHeader,
	isCompact,
	onRowClick,
	isLoading,
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
			return [...commonColumns, { Header: t("COMMON.CURRENCY"), className: "w-24 justify-end float-right" }];
		}

		if (showSignColumn) {
			return [...commonColumns, { Header: t("COMMON.SIGN"), className: "invisible w-24" }];
		}

		return commonColumns;
	}, [commonColumns, currencyRate, showSignColumn, isCompact, t]);

	return (
		<div className="relative">
			<Loader show={isLoading} />
			<Table hideHeader={hideHeader} columns={columns} data={transactions}>
				{(row: Contracts.TransactionDataType) =>
					isCompact ? (
						<TransactionCompactRow onClick={() => onRowClick?.(row)} transaction={row} />
					) : (
						<TransactionRow
							isLoading={isLoading}
							onClick={() => onRowClick?.(row)}
							transaction={row}
							currencyRate={currencyRate}
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
};
