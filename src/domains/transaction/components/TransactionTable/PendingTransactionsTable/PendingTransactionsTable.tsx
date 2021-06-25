import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

import { PendingTransferRow } from "../TransactionRow/PendingTransferRow";
import { SignedTransactionRow } from "../TransactionRow/SignedTransactionRow";
import { PendingTransaction, Properties } from "./PendingTransactionsTable.contracts";
import { createTableColumns } from "./PendingTransactionsTable.domain";

export const PendingTransactions = ({
	wallet,
	onClick,
	onPendingTransactionClick,
}: Properties) => {
	const { t } = useTranslation();

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

			<Table columns={createTableColumns(t)} data={transactions}>
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
