import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useCallback, useMemo } from "react";

export const useTransaction = () => {
	const fetchWalletUnconfirmedTransactions = useCallback(async (wallet: Contracts.IReadWriteWallet) => {
		try {
			return (await wallet.transactionIndex().sent({ limit: 20, cursor: 1 }))
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
