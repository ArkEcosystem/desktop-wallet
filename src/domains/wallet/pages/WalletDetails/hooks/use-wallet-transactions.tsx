import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { uniqBy } from "@arkecosystem/utils";
import { useActiveWallet } from "app/hooks";
import { useSynchronizer } from "app/hooks/use-synchronizer";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useWalletTransactions = (limit: number) => {
	const activeWallet = useActiveWallet();

	// TODO: Multi Signature PR
	const pendingTransactions: SignedTransactionData[] = [];
	const [transactions, setTransactions] = useState<ExtendedTransactionData[]>([]);
	const [nextPage, setNextPage] = useState<string | number | undefined>(1);
	const [isLoading, setIsLoading] = useState(false);

	const sync = useCallback(
		async (cursor: string | number | undefined) => {
			setIsLoading(true);
			const response = await activeWallet.transactions({ limit, cursor });
			setNextPage(response.nextPage());
			setTransactions((prev) => [...prev, ...response.items()]);
			setIsLoading(false);
		},
		[activeWallet, limit],
	);

	const fetchMore = useCallback(() => sync(nextPage), [nextPage, sync]);
	const fetchInit = useCallback(() => sync(1), [sync]);
	const hasMore = nextPage !== undefined;

	/**
	 * Run periodically every 30 seconds to check for new transactions
	 */
	const verifyNew = useCallback(async () => {
		const response = await activeWallet.transactions({ limit, cursor: 1 });
		setTransactions((prev) => uniqBy([...prev, ...response.items()], (item) => item.id()));
	}, [activeWallet, limit]);

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
