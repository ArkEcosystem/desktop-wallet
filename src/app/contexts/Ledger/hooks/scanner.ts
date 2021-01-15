import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { useCallback, useMemo, useReducer } from "react";

import { useEnvironmentContext } from "../../Environment";
import { useLedgerContext } from "../Ledger";
import { customDerivationModes } from "../utils";
import { scannerReducer } from "./scanner.state";
import { createRange, searchAddresses, searchWallets } from "./scanner.utils";

export const useLedgerScanner = (coin: string, network: string, profile: Profile) => {
	const { env } = useEnvironmentContext();
	const { setBusy, setIdle } = useLedgerContext();

	const [state, dispatch] = useReducer(scannerReducer, {
		derivationModes: [],
		currentDerivationModeIndex: 0,
		page: 0,
		selected: [],
		loading: [],
		wallets: [],
		failed: [],
	});

	const limitPerPage = 5;
	const derivationModes = useMemo(
		() => Object.keys(customDerivationModes[coin as keyof typeof customDerivationModes] || {}),
		[coin],
	);
	const { loading, failed, selected, page, wallets, currentDerivationModeIndex } = state;

	// Getters

	const isLoading = useCallback((path: string) => loading.some((item) => path === item), [loading]);
	const isSelected = useCallback((path: string) => selected.some((item) => path === item), [selected]);
	const isFailed = useCallback((path: string) => failed.some((item) => path === item), [failed]);
	const hasNewWallet = useMemo(() => wallets.some((item) => item.isNew), [wallets]);
	const hasMoreDerivationModes = useMemo(() => derivationModes.length - 1 > currentDerivationModeIndex, [
		derivationModes,
		currentDerivationModeIndex,
	]);
	const selectedWallets = useMemo(() => wallets.filter((item) => selected.includes(item.path)), [selected, wallets]);
	const canRetry = useMemo(() => failed.length > 0, [failed]);

	const scan = useCallback(
		async (indexes: number[]) => {
			setBusy();

			try {
				const instance = await env.coin(coin, network);

				const addressMap = await searchAddresses(
					indexes,
					instance,
					profile,
					derivationModes[currentDerivationModeIndex],
				);
				const lazyWallets = Object.entries(addressMap).map(([address, path]) => ({ address, path }));

				if (!lazyWallets.length) {
					return dispatch({ type: "next" });
				}

				dispatch({ type: "load", payload: lazyWallets, derivationModes });

				const wallets = await searchWallets(addressMap, instance);

				dispatch({ type: "success", payload: wallets });
			} catch {
				dispatch({ type: "failed" });
			}

			setIdle();
		},
		[coin, network, env, profile, setBusy, setIdle, derivationModes, currentDerivationModeIndex],
	);

	// Actions - Scan

	const scanMore = useCallback(() => scan(createRange(page, limitPerPage)), [scan, page]);
	// TODO:
	const scanRetry = useCallback(() => scan([]), [scan, failed]);

	// Recursive callback that will increase the page
	// and run on each re-rendering until it finds a new wallet or fail
	const scanUntilNewOrFail = useCallback(async () => {
		if (hasNewWallet || canRetry) {
			return;
		}

		await scanMore();
	}, [scanMore, hasNewWallet, canRetry]);

	// Actions - Selection

	const toggleSelect = (path: string) => dispatch({ type: "toggleSelect", path });
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
