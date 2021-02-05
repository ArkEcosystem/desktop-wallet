import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { useCallback, useMemo } from "react";

export const useTransaction = () => {
	const fetchWalletUnconfirmedTransactions = useCallback(async (wallet: ReadWriteWallet) => {
		const sent = await wallet.sentTransactions({ limit: 20, cursor: 1 });
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
