import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { uniqBy } from "@arkecosystem/utils";
import { useCallback, useMemo, useReducer, useRef, useState } from "react";

import { useLedgerContext } from "../Ledger";
import { LedgerData } from "../utils";
import { scannerReducer } from "./scanner.state";

export const useLedgerScanner = (coin: string, network: string) => {
	const { setBusy, setIdle } = useLedgerContext();

	const [state, dispatch] = useReducer(scannerReducer, {
		selected: [],
		wallets: [],
	});

	const { selected, wallets, error } = state;

	const isSelected = useCallback((path: string) => selected.some((item) => path === item), [selected]);

	const selectedWallets = useMemo(() => wallets.filter((item) => selected.includes(item.path)), [selected, wallets]);
	const canRetry = !!error;

	const [isScanning, setIsScanning] = useState(false);
	const abortRetryRef = useRef<boolean>(false);

	const scan = useCallback(
		async (profile: Contracts.IProfile) => {
			setIsScanning(true);
			setBusy();
			abortRetryRef.current = false;

			try {
				const instance = profile.coins().set(coin, network);

				const lastImportedPath = profile
					.wallets()
					.values()
					.map((wallet) => wallet.data().get<string>(Contracts.WalletData.DerivationPath))
					.filter(Boolean)
					.sort()
					.reverse()[0];

				// @ts-ignore
				const wallets = await instance.ledger().scan({ startPath: lastImportedPath });
				const legacyWallets = await instance.ledger().scan({ useLegacy: true });

				const allWallets = { ...legacyWallets, ...wallets };

				let ledgerData: LedgerData[] = [];

				for (const [path, data] of Object.entries(allWallets)) {
					const address = data.address();

					/* istanbul ignore next */
					if (!profile.wallets().findByAddress(address)) {
						ledgerData.push({
							path,
							address,
							balance: data.balance().available,
						});
					}
				}

				ledgerData = uniqBy(ledgerData, (wallet) => wallet.address);

				if (abortRetryRef.current) {
					return;
				}

				dispatch({ type: "success", payload: ledgerData });
			} catch (error) {
				dispatch({ type: "failed", error: error.message });
			}

			setIdle();
			setIsScanning(false);
		},
		[coin, network, setBusy, setIdle],
	);

	const abortScanner = useCallback(() => {
		abortRetryRef.current = true;
		setIdle();
	}, [setIdle]);

	const toggleSelect = (path: string) => dispatch({ type: "toggleSelect", path });
	const toggleSelectAll = () => dispatch({ type: "toggleSelectAll" });

	return {
		isScanning,
		isSelected,
		canRetry,
		scan,
		toggleSelectAll,
		toggleSelect,
		wallets,
		selectedWallets,
		abortScanner,
		error,
	};
};
