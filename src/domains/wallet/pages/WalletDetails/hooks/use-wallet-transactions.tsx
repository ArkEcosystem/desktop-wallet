import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { ExtendedTransactionData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { uniqBy } from "@arkecosystem/utils";
import { useSynchronizer } from "app/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useWalletTransactions = (
	wallet: ReadWriteWallet,
	{ limit, mode = "all", transactionType }: { limit: number; mode?: string; transactionType?: any },
) => {
	const pendingMultiSignatureTransactions: SignedTransactionData[] = Object.values({
		...wallet.transaction().waitingForOtherSignatures(),
		...wallet.transaction().waitingForOurSignature(),
		...wallet.transaction().signed(),
	}).filter((item) => item.isMultiSignature());

	const [transactions, setTransactions] = useState<ExtendedTransactionData[]>([]);
	const [itemCount, setItemCount] = useState<number>(0);
	const [nextPage, setNextPage] = useState<string | number | undefined>();
	const [isLoading, setIsLoading] = useState(false);

	const syncMultiSignatures = useCallback(async () => {
		await wallet.transaction().sync();

		const broadcasted = Object.keys(wallet.transaction().broadcasted());

		await Promise.allSettled(broadcasted.map((id) => wallet.transaction().confirm(id)));
	}, [wallet]);

	const sync = useCallback(
		async (cursor: string | number | undefined) => {
			setIsLoading(true);

			const methodMap = {
				all: "transactions",
				sent: "sentTransactions",
				received: "receivedTransactions",
			};

			const method = methodMap[mode as keyof typeof methodMap];

			const defaultQueryParams = { limit, cursor };
			const queryParams = transactionType ? { ...defaultQueryParams, ...transactionType } : defaultQueryParams;
			// @ts-ignore
			const response = await wallet[method](queryParams);

			setItemCount(response.items().length);
			setNextPage(response.nextPage());
			setTransactions((prev) => [...prev, ...response.items()]);
			setIsLoading(false);
		},
		[wallet, limit, mode, transactionType],
	);

	const fetchMore = useCallback(() => sync(nextPage), [nextPage, sync]);

	const fetchInit = useCallback(async () => {
		setItemCount(0);
		setNextPage(undefined);
		setTransactions([]);
		await sync(1);
		await syncMultiSignatures();
	}, [sync, syncMultiSignatures]);

	const hasMore = itemCount === limit && nextPage !== undefined;

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
			{
				callback: syncMultiSignatures,
				interval: 30000,
			},
		],
		[verifyNew, syncMultiSignatures],
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
		pendingMultiSignatureTransactions,
		syncMultiSignatures,
	};
};
