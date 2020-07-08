import { Button } from "app/components/Button";
import { Table } from "app/components/Table";
import { TransactionListItem } from "app/components/TransactionListItem";
import React from "react";
import { useTranslation } from "react-i18next";
import i18n from 'i18next'

type TransactionsProps = {
	title: string;
	columns: any;
	transactions?: any;
	emptyText?: string;
};

export const Transactions = ({ transactions, columns, title, emptyText }: TransactionsProps) => {
	const { t } = useTranslation();

	return (
		<div className="bg-white">
			<div className="text-4xl font-bold">{title}</div>
			{transactions.length > 0 && (
				<div className="pt-8">
					<Table columns={columns} data={transactions}>
						{(rowData: any) => <TransactionListItem {...rowData} />}
					</Table>

					<Button variant="plain" className="w-full mt-10 mb-5">
						{t("COMMON.VIEW_MORE")}
					</Button>
				</div>
			)}
			{transactions.length === 0 && <div className="text-theme-neutral-700">{emptyText}</div>}
		</div>
	);
};

Transactions.defaultProps = {
	title: i18n.t("DASHBOARD.TRANSACTION_HISTORY.TITLE"),
	emptyText: i18n.t("DASHBOARD.TRANSACTION_HISTORY.EMPTY_TEXT"),
	columns: [
		{
			Header: i18n.t("COMMON.DATE"),
		},
		{
			Header: i18n.t("COMMON.TYPE"),
			className: "invisible",
		},
		{
			Header: i18n.t("COMMON.WALLET_ADDRESS"),
		},
		{
			Header: i18n.t("COMMON.INFO"),
			className: "justify-center",
		},
		{
			Header: i18n.t("COMMON.AMOUNT"),
			className: "float-right",
		},
		{
			Header: i18n.t("COMMON.FIAT_VALUE"),
			className: "float-right",
		},
	],
	transactions: [],
};
