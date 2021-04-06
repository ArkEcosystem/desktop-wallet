import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { IReadWriteWallet } from "@arkecosystem/platform-sdk-profiles/dist/contracts";
import { useCallback, useEffect, useRef, useState } from "react";

type TransactionsState = {
	transactions: DTO.ExtendedTransactionData[];
	isLoadingTransactions: boolean;
	isLoadingMore: boolean;
	activeMode?: string;
	activeTransactionType?: any;
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
};

export const useProfileTransactions = ({
	profile,
	wallets,
}: {
	profile: Contracts.IProfile;
	wallets: Contracts.IReadWriteWallet[];
}) => {
	const lastActiveMode = useRef<string>();

	const [
		{ transactions, activeMode, activeTransactionType, isLoadingTransactions, isLoadingMore },
		setState,
	] = useState<TransactionsState>({
		isLoadingMore: false,
		isLoadingTransactions: true,
		transactions: [],
		activeMode: undefined,
		activeTransactionType: undefined,
	});

	useEffect(() => {
		const loadTransactions = async () => {
			const fetchedTransactions = await fetchTransactions({
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

			setState((state) => ({ ...state, transactions: fetchedTransactions, isLoadingTransactions: false }));
		};

		if (!lastActiveMode.current) {
			return;
		}

		setTimeout(() => loadTransactions(), 0);

		// eslint-disable-next-line
	}, [wallets.length, activeMode, activeTransactionType]);

	const updateFilters = useCallback(
		({ activeMode, activeTransactionType }: TransactionFilters) => {
			lastActiveMode.current = JSON.stringify({ activeMode, activeTransactionType });

			const hasWallets = wallets.length !== 0;

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
		async ({ flush = false, mode = "all", transactionType, wallets = [] }: FetchTransactionProps) => {
			if (wallets.length === 0) {
				return [];
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

			const defaultQuery = { limit: 30, addresses: wallets.map((wallet) => wallet.address()) };
			const queryParams = transactionType ? { ...defaultQuery, ...transactionType } : defaultQuery;

			// @ts-ignore
			const response = await profile.transactionAggregate()[method](queryParams);
			const transactionsAggregate = response.items();

			return transactionsAggregate;
		},
		[profile],
	);

	const fetchMore = useCallback(async () => {
		setState((state) => ({ ...state, isLoadingMore: true }));

		const nextPage = await fetchTransactions({
			flush: false,
			mode: activeMode,
			transactionType: activeTransactionType,
			wallets,
		});

		setState((state) => ({
			...state,
			isLoadingMore: false,
			transactions: [...state.transactions, ...nextPage],
		}));
	}, [activeMode, activeTransactionType, wallets.length]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		fetchTransactions,
		fetchMore,
		updateFilters,
		transactions,
		activeMode,
		activeTransactionType,
		isLoadingTransactions,
		isLoadingMore,
	};
};
