import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

import { PendingTransferRow } from "../TransactionRow/PendingTransferRow";
import { SignedTransactionRow } from "../TransactionRow/SignedTransactionRow";

interface Properties {
	wallet: Contracts.IReadWriteWallet;
	onClick?: (transaction: DTO.ExtendedSignedTransactionData) => void;
	onPendingTransactionClick?: (transaction: DTO.ExtendedConfirmedTransactionData) => void;
}

interface PendingTransaction {
	transaction: DTO.ExtendedConfirmedTransactionData | DTO.ExtendedSignedTransactionData;
	hasBeenSigned: boolean;
	isAwaitingConfirmation: boolean;
	isAwaitingOurSignature: boolean;
	isAwaitingOtherSignatures: boolean;
}

export const PendingTransactions = ({
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

	const transactions: PendingTransaction[] = [];

	for (const [id, transaction] of Object.entries(wallet.transaction().pending())) {
		transactions.push({
			transaction,
			hasBeenSigned: wallet.transaction().hasBeenSigned(id),
			isAwaitingConfirmation: wallet.transaction().isAwaitingConfirmation(id),
			isAwaitingOurSignature: wallet.transaction().isAwaitingOurSignature(id),
			isAwaitingOtherSignatures: wallet.transaction().isAwaitingOtherSignatures(id),
		});
	}

	return (
		<div data-testid="PendingTransactions" className="relative">
			<h2 className="mb-6">{t("WALLETS.PAGE_WALLET_DETAILS.PENDING_TRANSACTIONS")}</h2>

			<Table columns={columns} data={transactions}>
				{(transaction: PendingTransaction) => {
					if (transaction.hasBeenSigned || transaction.isAwaitingConfirmation) {
						return (
							<PendingTransferRow
								wallet={wallet}
								transaction={transaction.transaction as DTO.ExtendedConfirmedTransactionData}
								onRowClick={onPendingTransactionClick}
							/>
						);
					}

					return (
						<SignedTransactionRow
							transaction={transaction.transaction as DTO.ExtendedSignedTransactionData}
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
