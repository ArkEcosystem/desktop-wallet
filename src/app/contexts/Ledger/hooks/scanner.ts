import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useCallback, useMemo, useReducer, useRef, useState } from "react";

import { useEnvironmentContext } from "../../Environment";
import { useLedgerContext } from "../Ledger";
import { customDerivationModes } from "../utils";
import { scannerReducer } from "./scanner.state";

export const useLedgerScanner = (coin: string, network: string, profile: Contracts.IProfile) => {
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
		/* istanbul ignore next */
		() => Object.keys(customDerivationModes[coin as keyof typeof customDerivationModes] || {}),
		[coin],
	);
	const { loading, failed, selected, page, wallets, currentDerivationModeIndex } = state;

	// Getters

	const isLoading = useCallback((path: string) => loading.some((item) => path === item), [loading]);
	const isSelected = useCallback((path: string) => selected.some((item) => path === item), [selected]);
	/* istanbul ignore next */
	const isFailed = useCallback((path: string) => failed.some((item) => path === item), [failed]);
	const hasNewWallet = useMemo(() => wallets.some((item) => item.isNew), [wallets]);
	const selectedWallets = useMemo(() => wallets.filter((item) => selected.includes(item.path)), [selected, wallets]);
	const canRetry = useMemo(() => failed.length > 0, [failed]);
	const [isScanning, setIsScanning] = useState(false);
	const abortRetryRef = useRef<boolean>(false);

	const scan = useCallback(async () => {
		setBusy();
		abortRetryRef.current = false;

		try {
			const instance = await env.coin(coin, network);
			const result = await instance.ledger().scan();
			console.log({ result });

			// const derivationMode = derivationModes[currentDerivationModeIndex];

			// const addressMap = await searchAddresses(indexes, instance, profile, derivationMode);
			// const lazyWallets = Object.values(addressMap);

			// if (!lazyWallets.length) {
			// return dispatch({ type: "next" });
			// }

			// dispatch({ type: "load", payload: lazyWallets, derivationModes });

			// const wallets = await searchWallets(addressMap, instance);

			// if (abortRetryRef.current) {
			// return;
			// }

			dispatch({ type: "success", payload: wallets });
		} catch (e) {
			console.error(e);
			dispatch({ type: "failed" });
		}

		setIdle();
	}, [coin, network, env, profile, setBusy, setIdle]);

	const abortScanner = useCallback(() => {
		abortRetryRef.current = true;
		setIdle();
	}, [setIdle]);

	// Actions - Scan

	const scanMore = scan;
	const scanRetry = useCallback(async () => {
		//
	}, []);

	// Recursive callback that will increase the page
	// and run on each re-rendering until it finds a new wallet or fail
	const scanUntilNewOrFail = useCallback(async () => {
		//
	}, []);

	// Actions - Selection

	const toggleSelect = (path: string) => dispatch({ type: "toggleSelect", path });
	const toggleSelectAll = () => dispatch({ type: "toggleSelectAll" });

	return {
		isScanning,
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
		abortScanner,
	};
};
