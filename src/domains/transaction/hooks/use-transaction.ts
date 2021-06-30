import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useCallback, useMemo } from "react";

export const useTransaction = () => {
	const fetchWalletUnconfirmedTransactions = useCallback(async (wallet: Contracts.IReadWriteWallet) => {
		try {
			return (await wallet.transactionIndex().sent({ cursor: 1, limit: 20 }))
				.items()
				.filter(
					(transaction) =>
						!transaction.isConfirmed() && (transaction.isMultiPayment() || transaction.isTransfer()),
				);
		} catch {
			return [];
		}
	}, []);

	return useMemo(
		() => ({
			fetchWalletUnconfirmedTransactions,
		}),
		[fetchWalletUnconfirmedTransactions],
	);
};
