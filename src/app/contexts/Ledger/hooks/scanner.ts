import { useCallback, useMemo, useReducer, useRef, useState } from "react";

import { useEnvironmentContext } from "../../Environment";
import { useLedgerContext } from "../Ledger";
import { LedgerData } from "../utils";
import { scannerReducer } from "./scanner.state";

export const useLedgerScanner = (coin: string, network: string) => {
	const { env } = useEnvironmentContext();
	const { setBusy, setIdle } = useLedgerContext();

	const [state, dispatch] = useReducer(scannerReducer, {
		selected: [],
		wallets: [],
	});

	const { selected, wallets, error } = state;

	// Getters

	const isSelected = useCallback((path: string) => selected.some((item) => path === item), [selected]);

	const selectedWallets = useMemo(() => wallets.filter((item) => selected.includes(item.path)), [selected, wallets]);
	const canRetry = !!error;

	const [isScanning, setIsScanning] = useState(false);
	const abortRetryRef = useRef<boolean>(false);

	const scan = useCallback(async () => {
		setBusy();
		abortRetryRef.current = false;

		try {
			const instance = await env.coin(coin, network);

			const wallets = await instance.ledger().scan();
			const legacyWallets = await instance.ledger().scan({ useLegacy: true });

			const allWallets = { ...legacyWallets, ...wallets };
			const ledgerData: LedgerData[] = [];

			for (const [path, data] of Object.entries(allWallets)) {
				ledgerData.push({
					path,
					address: data.address(),
					balance: data.balance(),
				});
			}

			if (abortRetryRef.current) {
				return;
			}

			dispatch({ type: "success", payload: ledgerData });
		} catch (e) {
			dispatch({ type: "failed", error: e.message });
		}

		setIdle();
	}, [coin, network, env, setBusy, setIdle]);

	const abortScanner = useCallback(() => {
		abortRetryRef.current = true;
		setIdle();
	}, [setIdle]);

	const scanUntilNewOrFail = useCallback(async () => {
		setIsScanning(true);
		await scan();
		setIsScanning(false);
	}, [scan]);

	// Actions - Selection

	const toggleSelect = (path: string) => dispatch({ type: "toggleSelect", path });
	const toggleSelectAll = () => dispatch({ type: "toggleSelectAll" });

	return {
		isScanning,
		isSelected,
		canRetry,
		scanUntilNewOrFail,
		toggleSelectAll,
		toggleSelect,
		wallets,
		selectedWallets,
		abortScanner,
	};
};
