import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { ExtendedTransactionData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { uniqBy } from "@arkecosystem/utils";
import { useSynchronizer } from "app/hooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useWalletTransactions = (
	wallet: ReadWriteWallet,
	{ limit, mode = "all", transactionType }: { limit: number; mode?: string; transactionType?: any },
) => {
	const pendingMultiSignatureTransactions: SignedTransactionData[] = Object.values({
		...wallet.transaction().waitingForOtherSignatures(),
		...wallet.transaction().waitingForOurSignature(),
		...wallet.transaction().signed(),
	})
		// TODO: Use the `isMultiSignature()` method from interface when ready on the platform-sdk
		.filter((item) => !!item.get("multiSignature"));

	const [transactions, setTransactions] = useState<ExtendedTransactionData[]>([]);
	const [itemCount, setItemCount] = useState<number>(0);
	const [nextPage, setNextPage] = useState<string | number | undefined>();
	const [isLoading, setIsLoading] = useState(false);

	const syncMultiSignatures = useCallback(async () => {
		await wallet.transaction().sync();

		const broadcasted = Object.keys(wallet.transaction().broadcasted());

		await Promise.allSettled(broadcasted.map((id) => wallet.transaction().confirm(id)));
	}, [wallet]);

	const abortRef = useRef<() => void>();

	const sync = useCallback(
		async (cursor: string | number | undefined) => {
			if (abortRef.current) {
				abortRef.current();
			}

			let aborted = false;

			abortRef.current = () => (aborted = true);

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

			if (aborted) {
				return;
			}

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
		const methodMap = {
			all: "transactions",
			sent: "sentTransactions",
			received: "receivedTransactions",
		};

		const method = methodMap[mode as keyof typeof methodMap];
		const queryParams = transactionType ? { limit, cursor: 1, ...transactionType } : { limit, cursor: 1 };
		// @ts-ignore
		const response = await wallet[method](queryParams);

		setTransactions((prev) => uniqBy([...response.items(), ...prev], (item) => item.id()));
	}, [wallet, limit, mode, transactionType]);

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
