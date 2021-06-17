import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

import { UnconfirmedTransactionRow } from "./UnconfirmedTransactionRow";

interface Properties {
	transactions: DTO.ExtendedTransactionData[];
}

export const UnconfirmedTransactionTable = memo(({ transactions }: Properties) => {
	const { t } = useTranslation();

	const columns: any = [
		{
			Header: t("COMMON.DATE"),
			accessor: (transaction: DTO.ExtendedTransactionData) => transaction.timestamp?.()?.toUNIX(),
			sortDescFirst: true,
		},
		{
			Header: t("COMMON.RECIPIENT"),
		},
		{
			Header: t("COMMON.AMOUNT"),
			accessor: (transaction: DTO.ExtendedTransactionData) => transaction.total?.().toHuman(),
			className: "justify-end",
		},
	];

	return (
		<div data-testid="TransactionTable" className="relative">
			<Table columns={columns} data={transactions}>
				{(row: DTO.ExtendedTransactionData) => <UnconfirmedTransactionRow transaction={row} />}
			</Table>
		</div>
	);
});
