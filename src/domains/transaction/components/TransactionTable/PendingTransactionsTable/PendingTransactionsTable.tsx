import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

import { PendingTransferRow } from "../TransactionRow/PendingTransferRow";
import { SignedTransactionRow } from "../TransactionRow/SignedTransactionRow";

interface Properties {
	transfers?: DTO.ExtendedConfirmedTransactionData[];
	signed?: DTO.ExtendedSignedTransactionData[];
	wallet: Contracts.IReadWriteWallet;
	onClick?: (transaction: DTO.ExtendedSignedTransactionData) => void;
	onPendingTransactionClick?: (transaction: DTO.ExtendedConfirmedTransactionData) => void;
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
			cellWidth: "w-50",
			sortDescFirst: true,
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
			cellWidth: "w-24",
			className: "hidden",
		},
	];

	return (
		<div data-testid="PendingTransactions" className="relative">
			<h2 className="mb-6">{t("WALLETS.PAGE_WALLET_DETAILS.PENDING_TRANSACTIONS")}</h2>

			<Table columns={columns} data={[...transfers, ...signed]}>
				{(transaction: DTO.ExtendedConfirmedTransactionData | DTO.ExtendedSignedTransactionData) => {
					if (transaction.isMultiPayment() || transaction.isTransfer()) {
						return (
							<PendingTransferRow
								wallet={wallet}
								transaction={transaction as DTO.ExtendedConfirmedTransactionData}
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
