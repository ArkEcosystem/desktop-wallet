import { ExtendedTransactionData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { uniqBy } from "@arkecosystem/utils";
import { useSynchronizer } from "app/hooks/use-synchronizer";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useWalletTransactions = (wallet: ReadWriteWallet, { limit }: { limit: number }) => {
	const pendingTransactions: SignedTransactionData[] = Object.values({
		...wallet.transaction().waitingForOtherSignatures(),
		...wallet.transaction().waitingForOurSignature(),
	});

	const [transactions, setTransactions] = useState<ExtendedTransactionData[]>([]);
	const [nextPage, setNextPage] = useState<string | number | undefined>();
	const [isLoading, setIsLoading] = useState(false);

	const sync = useCallback(
		async (cursor: string | number | undefined) => {
			setIsLoading(true);

			await wallet.transaction().sync();

			const response = await wallet.transactions({ limit, cursor });

			setNextPage(response.nextPage());
			setTransactions((prev) => [...prev, ...response.items()]);
			setIsLoading(false);
		},
		[wallet, limit],
	);

	const fetchMore = useCallback(() => sync(nextPage), [nextPage, sync]);

	const fetchInit = useCallback(async () => {
		setNextPage(undefined);
		setTransactions([]);
		await sync(1);
	}, [sync]);

	const hasMore = nextPage !== undefined;

	/**
	 * Run periodically every 30 seconds to check for new transactions
	 */
	const verifyNew = useCallback(async () => {
		const response = await wallet.transactions({ limit, cursor: 1 });
		setTransactions((prev) => uniqBy([...response.items(), ...prev], (item) => item.id()));
	}, [wallet, limit]);

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
