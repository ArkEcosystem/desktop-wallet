import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import Transport from "@ledgerhq/hw-transport";
import { useEnvironmentContext } from "app/contexts";
import retry from "async-retry";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

import { defaultLedgerState, ledgerStateReducer } from "./Ledger.state";

const formatDerivationPath = (coinType: number, index: number) => `44'/${coinType}'/${index}'/0/0`;

export const useLedger = (transport: typeof Transport) => {
	const { env } = useEnvironmentContext();

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

	const connect = useCallback(
		async (
			coin: Coins.Coin,
			retryOptions: retry.Options = { retries: 50, randomize: false, factor: 1, minTimeout: 2000 },
		) => {
			dispatch({ type: "waiting" });
			abortRetryRef.current = false;

			try {
				const slip44 = coin.config().get<number>("network.crypto.slip44");

				const connectFn: retry.RetryFunction<void> = async (bail, attempts) => {
					if (abortRetryRef.current && attempts > 1) {
						bail(new Error("User aborted"));
					}

					await coin.ledger().connect(transport);
					await coin.ledger().getPublicKey(formatDerivationPath(slip44, 0));
				};

				await retry(connectFn, retryOptions);
				dispatch({ type: "connected" });
			} catch (e) {
				coin.ledger().disconnect();
				dispatch({ type: "failed", message: e.message });
			}
		},
		[transport],
	);

	const disconnect = useCallback(async (coin: Coins.Coin) => {
		await coin.ledger().disconnect();
		dispatch({ type: "disconnected" });
	}, []);

	const scanWallets = useCallback(
		async (coin: string, network: string, profile: Profile) => {
			const instance = await env.coin(coin, network);
			const slip44 = instance.config().get<number>("network.crypto.slip44");

			await connect(instance);

			dispatch({ type: "busy" });

			const wallets: Contracts.WalletData[] = [];
			let hasMore = true;
			let cursor = 0;

			while (hasMore) {
				const path = formatDerivationPath(slip44, cursor);
				const publicKey = await instance.ledger().getPublicKey(path);
				const address = await instance.identity().address().fromPublicKey(publicKey);

				// Already imported
				if (profile.wallets().findByPublicKey(publicKey)) {
					cursor++;
					continue;
				}

				try {
					const identity = await instance.client().wallet(address);

					if (!identity) {
						throw new Error();
					}

					wallets.push(identity);
				} catch {
					hasMore = false;
				}

				cursor++;
			}

			await disconnect(instance);

			return wallets;
		},
		[env, connect, disconnect],
	);

	const abortConnectionRetry = () => (abortRetryRef.current = true);
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
		error,
		hasDeviceAvailable,
		isAwaitingConnection,
		isAwaitingDeviceConfirmation,
		isBusy,
		isConnected,
		scanWallets,
	};
};
