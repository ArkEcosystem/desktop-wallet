import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { useCallback, useMemo, useReducer } from "react";

import { useEnvironmentContext } from "../../Environment";
import { useLedgerContext } from "../Ledger";
import { scannerReducer } from "./scanner.state";
import { createRange, searchAddresses, searchWallets } from "./scanner.utils";

export const useLedgerScanner = (coin: string, network: string, profile: Profile) => {
	const { env } = useEnvironmentContext();
	const { setBusy, setIdle } = useLedgerContext();

	const [state, dispatch] = useReducer(scannerReducer, {
		page: 0,
		selected: [],
		loading: [],
		wallets: [],
		failed: [],
	});

	const limitPerPage = 5;
	const { loading, failed, selected, page, wallets } = state;

	// Getters

	const isLoading = useCallback((index: number) => loading.some((item) => index === item), [loading]);
	const isSelected = useCallback((index: number) => selected.some((item) => index === item), [selected]);
	const isFailed = useCallback((index: number) => failed.some((item) => index === item), [failed]);
	const hasNewWallet = useMemo(() => wallets.some((item) => item.isNew), [wallets]);
	const selectedWallets = useMemo(() => wallets.filter((item) => selected.includes(item.index)), [selected, wallets]);
	const canRetry = useMemo(() => failed.length > 0, [failed]);

	const scan = useCallback(
		async (indexes: number[]) => {
			setBusy();

			try {
				const instance = await env.coin(coin, network);

				const addressMap = await searchAddresses(indexes, instance, profile);
				const lazyWallets = Object.entries(addressMap).map(([address, index]) => ({ address, index }));

				if (!lazyWallets.length) {
					return dispatch({ type: "next" });
				}

				dispatch({ type: "load", payload: lazyWallets });

				const wallets = await searchWallets(addressMap, instance);

				dispatch({ type: "success", payload: wallets });
			} catch {
				dispatch({ type: "failed" });
			}

			setIdle();
		},
		[coin, network, env, profile, setBusy, setIdle],
	);

	// Actions - Scan

	const scanMore = useCallback(() => scan(createRange(page, limitPerPage)), [scan, page]);
	const scanRetry = useCallback(() => scan(failed), [scan, failed]);

	// Recursive callback that will increase the page
	// and run on each re-rendering until it finds a new wallet or fail
	const scanUntilNewOrFail = useCallback(async () => {
		if (hasNewWallet || canRetry) {
			return;
		}

		await scanMore();
	}, [scanMore, hasNewWallet, canRetry]);

	// Actions - Selection

	const toggleSelect = (index: number) => dispatch({ type: "toggleSelect", index });
	const toggleSelectAll = () => dispatch({ type: "toggleSelectAll" });

	return {
		canRetry,
		hasNewWallet,
		isFailed,
		isLoading,
		isSelected,
		scanMore,
		scanRetry,
		scanUntilNewOrFail,
		toggleSelectAll,
		toggleSelect,
		wallets,
		selectedWallets,
	};
};
