import { ExtendedTransactionData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { uniqBy } from "@arkecosystem/utils";
import { useSynchronizer } from "app/hooks/use-synchronizer";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useWalletTransactions = (wallet: ReadWriteWallet, query: { limit: number }) => {
	// TODO: Multi Signature PR
	const pendingTransactions: SignedTransactionData[] = [];
	const [transactions, setTransactions] = useState<ExtendedTransactionData[]>([]);
	const [nextPage, setNextPage] = useState<string | number | undefined>(1);
	const [isLoading, setIsLoading] = useState(false);

	const sync = useCallback(
		async (cursor: string | number | undefined) => {
			setIsLoading(true);
			const response = await wallet.transactions({ ...query, cursor });
			setNextPage(response.nextPage());
			setTransactions((prev) => [...prev, ...response.items()]);
			setIsLoading(false);
		},
		[wallet, query],
	);

	const fetchMore = useCallback(() => sync(nextPage), [nextPage, sync]);
	const fetchInit = useCallback(() => sync(1), [sync]);
	const hasMore = nextPage !== undefined;

	/**
	 * Run periodically every 30 seconds to check for new transactions
	 */
	const verifyNew = useCallback(async () => {
		const response = await wallet.transactions({ ...query, cursor: 1 });
		setTransactions((prev) => uniqBy([...response.items(), ...prev], (item) => item.id()));
	}, [wallet, query]);

	const jobs = useMemo(
		() => [
			{
				callback: verifyNew,
				interval: 30000,
			},
		],
		[verifyNew],
	);

	const { start } = useSynchronizer(jobs);

	useEffect(() => {
		start();
	}, [start]);

	return {
		isLoading,
		fetchInit,
		fetchMore,
		hasMore,
		transactions,
		pendingTransactions,
	};
};
