import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import React from "react";
import { PendingTransaction, Properties } from "./PendingTransactionsTable.contracts";

import { PendingTransferRow } from "../TransactionRow/PendingTransferRow";
import { SignedTransactionRow } from "../TransactionRow/SignedTransactionRow";
import { usePendingTransactions } from "./hooks/use-pending-transactions";
import { useTranslation } from "react-i18next";

export const PendingTransactions = ({ wallet, onClick, onPendingTransactionClick }: Properties) => {
	const { t } = useTranslation();
	const { columns, transactions } = usePendingTransactions({ wallet });

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
