import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { IReadWriteWallet } from "@arkecosystem/platform-sdk-profiles/dist/contracts";
import { useCallback, useEffect, useRef, useState } from "react";

type TransactionsState = {
	transactions: DTO.ExtendedTransactionData[];
	isLoadingTransactions: boolean;
	isLoadingMore: boolean;
	activeMode?: string;
	activeTransactionType?: any;
	hasMore?: boolean;
};

type TransactionFilters = {
	activeMode?: string;
	activeTransactionType?: any;
};

type FetchTransactionProps = {
	flush?: boolean;
	mode?: string;
	transactionType?: any;
	wallets: IReadWriteWallet[];
	cursor?: number;
};

export const useProfileTransactions = ({
	profile,
	wallets,
}: {
	profile: Contracts.IProfile;
	wallets: Contracts.IReadWriteWallet[];
}) => {
	const lastActiveMode = useRef<string>();
	const isMounted = useRef(true);
	const cursor = useRef(1);

	const [
		{ transactions, activeMode, activeTransactionType, isLoadingTransactions, isLoadingMore, hasMore },
		setState,
	] = useState<TransactionsState>({
		hasMore: true,
		isLoadingMore: false,
		isLoadingTransactions: true,
		transactions: [],
		activeMode: undefined,
		activeTransactionType: undefined,
	});

	useEffect(() => {
		const loadTransactions = async () => {
			const response = await fetchTransactions({
				wallets,
				flush: true,
				mode: activeMode!,
				transactionType: activeTransactionType,
			});

			const isAborted = () => {
				const activeQuery = JSON.stringify({ activeMode, activeTransactionType });
				return activeQuery !== lastActiveMode.current;
			};

			if (isAborted()) {
				return;
			}

			/* istanbul ignore next */
			if (!isMounted.current) {
				return;
			}

			setState((state) => ({
				...state,
				transactions: response.items(),
				isLoadingTransactions: false,
				hasMore: response.items().length > 0 && response.hasMorePages(),
			}));
		};

		if (!lastActiveMode.current) {
			return;
		}

		setTimeout(() => loadTransactions(), 0);

		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};

		// eslint-disable-next-line
	}, [wallets.length, activeMode, activeTransactionType]);

	const updateFilters = useCallback(
		({ activeMode, activeTransactionType }: TransactionFilters) => {
			lastActiveMode.current = JSON.stringify({ activeMode, activeTransactionType });

			const hasWallets = wallets.length !== 0;
			cursor.current = 1;

			/* istanbul ignore next */
			if (!isMounted.current) {
				return;
			}

			setState({
				transactions: [],
				isLoadingTransactions: hasWallets, // Don't set isLoading when there are no wallets
				activeMode,
				activeTransactionType,
				isLoadingMore: false,
			});
		},
		[wallets.length],
	);

	const fetchTransactions = useCallback(
		({ flush = false, mode = "all", transactionType, wallets = [], cursor = 1 }: FetchTransactionProps) => {
			if (wallets.length === 0) {
				return { items: () => [], hasMorePages: () => false };
			}

			const methodMap = {
				all: "transactions",
				sent: "sentTransactions",
				received: "receivedTransactions",
			};

			const method = methodMap[mode as keyof typeof methodMap];

			if (flush) {
				profile.transactionAggregate().flush(method);
			}

			const defaultQuery = { limit: 30, addresses: wallets.map((wallet) => wallet.address(), cursor) };
			const queryParams = transactionType ? { ...defaultQuery, ...transactionType } : defaultQuery;

			// @ts-ignore
			return profile.transactionAggregate()[method](queryParams);
		},
		[profile],
	);

	const fetchMore = useCallback(async () => {
		cursor.current = cursor.current + 1;
		setState((state) => ({ ...state, isLoadingMore: true }));

		const response = await fetchTransactions({
			flush: false,
			mode: activeMode,
			transactionType: activeTransactionType,
			wallets,
			cursor: cursor.current,
		});

		setState((state) => ({
			...state,
			isLoadingMore: false,
			hasMore: response.items().length > 0 && response.hasMorePages(),
			transactions: [...state.transactions, ...response.items()],
		}));
	}, [activeMode, activeTransactionType, wallets.length]); // eslint-disable-line react-hooks/exhaustive-deps

	// TODO: Run periodic checks for new transactions every 30 seconds

	return {
		fetchTransactions,
		fetchMore,
		updateFilters,
		transactions,
		activeMode,
		activeTransactionType,
		isLoadingTransactions,
		isLoadingMore,
		hasMore,
	};
};
