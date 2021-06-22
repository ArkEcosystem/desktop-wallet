import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

import { PendingTransferRow } from "../TransactionRow/PendingTransferRow";
import { SignedTransactionRow } from "../TransactionRow/SignedTransactionRow";

interface Properties {
	transfers?: DTO.ExtendedTransactionData[];
	signed?: DTO.ExtendedSignedTransactionData[];
	wallet: Contracts.IReadWriteWallet;
	onClick?: (transaction: DTO.ExtendedSignedTransactionData) => void;
	onPendingTransactionClick?: (transaction: DTO.ExtendedTransactionData) => void;
}

export const PendingTransactions = ({
	transfers = [],
	signed = [],
	wallet,
	onClick,
	onPendingTransactionClick,
}: Properties) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: t("COMMON.ID"),
			minimumWidth: true,
		},
		{
			Header: t("COMMON.DATE"),
			accessor: "timestamp",
			sortDescFirst: true,
			cellWidth: "w-50",
		},
		{
			Header: t("COMMON.RECIPIENT"),
			cellWidth: "w-96",
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
			accessor: "amount",
			className: "justify-end no-border",
		},
		{
			Header: "Sign",
			className: "hidden",
			cellWidth: "w-24",
		},
	];

	return (
		<div data-testid="PendingTransactions" className="relative">
			<h2 className="mb-6">{t("WALLETS.PAGE_WALLET_DETAILS.PENDING_TRANSACTIONS")}</h2>

			<Table columns={columns} data={[...transfers, ...signed]}>
				{(transaction: DTO.ExtendedTransactionData | DTO.ExtendedSignedTransactionData) => {
					if (transaction.isMultiPayment() || transaction.isTransfer()) {
						return (
							<PendingTransferRow
								wallet={wallet}
								transaction={transaction as DTO.ExtendedTransactionData}
								onRowClick={onPendingTransactionClick}
							/>
						);
					}

					return (
						<SignedTransactionRow
							transaction={transaction as DTO.ExtendedSignedTransactionData}
							wallet={wallet}
							onSign={onClick}
							onRowClick={onClick}
						/>
					);
				}}
			</Table>
		</div>
	);
};
