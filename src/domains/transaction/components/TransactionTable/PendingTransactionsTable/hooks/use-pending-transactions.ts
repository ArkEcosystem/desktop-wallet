import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { createTableColumns } from "../PendingTransactionsTable.domain";
import { PendingTransaction } from "../PendingTransactionsTable.contracts";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export const usePendingTransactions = ({ wallet }: { wallet: Contracts.IReadWriteWallet }) => {
	const { t } = useTranslation();
	const columns = createTableColumns(t);

	const transactions = useMemo(() => {
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

		return transactions;
	}, [wallet]);

	return { columns, transactions };
};
