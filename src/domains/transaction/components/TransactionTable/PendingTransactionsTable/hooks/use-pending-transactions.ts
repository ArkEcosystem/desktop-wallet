import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { PendingTransaction } from "../PendingTransactionsTable.contracts";
import { createTableColumns } from "../PendingTransactionsTable.domain";

export const usePendingTransactions = ({ wallet }: { wallet: Contracts.IReadWriteWallet }) => {
	const { t } = useTranslation();
	const columns = createTableColumns(t);

	const transactions = useMemo(() => {
		const transactions: PendingTransaction[] = [];

		for (const [id, transaction] of Object.entries(wallet.transaction().pending())) {
			const hasBeenSigned = wallet.transaction().hasBeenSigned(id);
			const isAwaitingConfirmation = wallet.transaction().isAwaitingConfirmation(id);
			const isAwaitingOurSignature = wallet.transaction().isAwaitingOurSignature(id);
			const isAwaitingOtherSignatures = wallet.transaction().isAwaitingOtherSignatures(id);
			const isMultisignature = !!wallet.transaction().transaction(id).get("multiSignature");
			const isPendingTransfer = !isMultisignature && (hasBeenSigned || isAwaitingConfirmation);

			transactions.push({
				hasBeenSigned,
				isAwaitingConfirmation,
				isAwaitingOtherSignatures,
				isAwaitingOurSignature,
				isPendingTransfer,
				transaction,
			});
		}

		return transactions;
	}, [wallet]);

	return { columns, transactions };
};
