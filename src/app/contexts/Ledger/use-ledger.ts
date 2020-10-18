import { Coins } from "@arkecosystem/platform-sdk";
import { Profile, WalletFlag } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { chunk } from "@arkecosystem/utils";
import Transport from "@ledgerhq/hw-transport";
import retry from "async-retry";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

import { useEnvironmentContext } from "../Environment";
import { defaultLedgerState, ledgerStateReducer } from "./Ledger.state";
import { formatDerivationPath, LedgerData, searchAddresses, searchWallets } from "./utils";

export const useLedger = (transport: typeof Transport) => {
	const { env, persist } = useEnvironmentContext();
	const [state, dispatch] = useReducer(ledgerStateReducer, defaultLedgerState);
	const abortRetryRef = useRef<boolean>(false);

	const { isBusy, isConnected, error } = state;

	const listenDevice = useCallback(
		() =>
			transport.listen({
				// @ts-ignore
				next: ({ type, descriptor, deviceModel }) => {
					if (type === "add") {
						dispatch({ type: "add", path: descriptor, id: deviceModel?.id || "nanoS" });
						return;
					}
					dispatch({ type: "remove" });
				},
				error: (e) => dispatch({ type: "failed", message: e.message }),
				complete: () => void 0,
			}),
		[transport],
	);

	const importLedgerWallets = useCallback(
		async (wallets: LedgerData[], coin: Coins.Coin, profile: Profile) => {
			for (const { address, index } of wallets) {
				const wallet = await profile
					.wallets()
					.importByAddress(address, coin.network().coin(), coin.network().id());
				wallet.data().set(WalletFlag.LedgerIndex, index);
			}
			await persist();
		},
		[persist],
	);

	const connect = useCallback(
		async (
			coin: string,
			network: string,
			retryOptions: retry.Options = { retries: 50, randomize: false, factor: 1 },
		) => {
			dispatch({ type: "waiting" });
			abortRetryRef.current = false;

			const instance = await env.coin(coin, network);

			try {
				const slip44 = instance.config().get<number>("network.crypto.slip44");

				const connectFn: retry.RetryFunction<void> = async (bail, attempts) => {
					if (abortRetryRef.current && attempts > 1) {
						bail(new Error("User aborted"));
					}

					await instance.ledger().connect(transport);
					// Ensure that the app is accessible
					await instance.ledger().getPublicKey(formatDerivationPath(slip44, 0));
				};

				await retry(connectFn, retryOptions);
				dispatch({ type: "connected" });
			} catch (connectError) {
				instance.ledger().disconnect();
				dispatch({ type: "failed", message: connectError.message });
				throw connectError;
			}
		},
		[transport, env],
	);

	const disconnect = useCallback(async (coin: Coins.Coin) => {
		await coin.ledger().disconnect();
		dispatch({ type: "disconnected" });
	}, []);

	const scanWallets = useCallback(
		async (coin: string, network: string, profile: Profile, onChange?: (wallets: LedgerData[]) => void) => {
			const allWallets: LedgerData[] = [];

			try {
				await connect(coin, network);

				const instance = await env.coin(coin, network);

				dispatch({ type: "busy" });

				// TODO: Get value from profile
				const limit = 50;
				const indexes = Array.from(Array(limit).keys());
				const chunks = chunk(indexes, 5);

				for (const iterator of chunks) {
					const addressMap = await searchAddresses(iterator, instance, profile);
					const ledgerWallets = await searchWallets(addressMap, instance);

					const addresses = Object.keys(addressMap);
					let hasMore = true;

					if (addresses.length > ledgerWallets.length) {
						const ledgerAddresses = ledgerWallets.map((wallet) => wallet.address);
						const coldAddress = addresses.find((address) => !ledgerAddresses.includes(address))!;

						ledgerWallets.push({
							address: coldAddress,
							balance: BigNumber.ZERO,
							index: addressMap[coldAddress],
							isNew: true,
						});

						hasMore = false;
					}

					onChange?.(ledgerWallets);
					allWallets.push(...ledgerWallets);

					if (!hasMore) {
						break;
					}
				}

				await disconnect(instance);
				return allWallets;
			} catch (e) {
				dispatch({ type: "failed", message: e.message });
			}

			return allWallets;
		},
		[env, connect, disconnect],
	);

	const abortConnectionRetry = useCallback(() => (abortRetryRef.current = true), []);
	const isAwaitingConnection = useMemo(() => state.isWaiting && !state.isConnected, [state]);
	const isAwaitingDeviceConfirmation = useMemo(() => state.isWaiting && state.isConnected, [state]);
	const hasDeviceAvailable = useMemo(() => !!state.device, [state]);

	useEffect(() => {
		const subscription = listenDevice();
		return () => {
			subscription?.unsubscribe();
		};
	}, [listenDevice]);

	return {
		abortConnectionRetry,
		connect,
		disconnect,
		error,
		hasDeviceAvailable,
		importLedgerWallets,
		isAwaitingConnection,
		isAwaitingDeviceConfirmation,
		isBusy,
		isConnected,
		scanWallets,
	};
};
