import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useCallback, useMemo } from "react";

export const useTransaction = () => {
	const fetchWalletUnconfirmedTransactions = useCallback(async (wallet: Contracts.IReadWriteWallet) => {
		const sent = await wallet.transactionIndex().sent({ limit: 20, cursor: 1 });
		return sent
			.items()
			.filter(
				(transaction) =>
					!transaction.isConfirmed() && (transaction.isMultiPayment() || transaction.isTransfer()),
			);
	}, []);

	return useMemo(
		() => ({
			fetchWalletUnconfirmedTransactions,
		}),
		[fetchWalletUnconfirmedTransactions],
	);
};
