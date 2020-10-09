import { Coins } from "@arkecosystem/platform-sdk";
import { Profile, WalletFlag } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Transport from "@ledgerhq/hw-transport";
import retry from "async-retry";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

import { useEnvironmentContext } from "../Environment";
import { defaultLedgerState, ledgerStateReducer } from "./Ledger.state";

const formatDerivationPath = (coinType: number, index: number) => `44'/${coinType}'/${index}'/0/0`;

export type LedgerData = {
	address: string;
	balance: BigNumber;
	index: number;
	name?: string;
};

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
			for (const { address, index, name } of wallets) {
				const wallet = await profile
					.wallets()
					.importByAddress(address, coin.network().coin(), coin.network().id());
				wallet.data().set(WalletFlag.LedgerIndex, index);

				if (name) {
					wallet.setAlias(name);
				}
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
		async (coin: string, network: string, profile: Profile, onChange?: (wallet: LedgerData) => void) => {
			const wallets: LedgerData[] = [];

			try {
				await connect(coin, network);

				const instance = await env.coin(coin, network);
				const slip44 = instance.config().get<number>("network.crypto.slip44");

				dispatch({ type: "busy" });

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

					let wallet: LedgerData;
					try {
						const identity = await instance.client().wallet(address);
						wallet = {
							address: identity.address(),
							balance: identity.balance(),
							index: cursor,
						};
					} catch {
						// New Cold Wallet
						wallet = {
							address,
							balance: BigNumber.ZERO,
							index: cursor,
						};
						hasMore = false;
					}
					onChange?.(wallet);
					wallets.push(wallet);
					cursor++;
				}

				await disconnect(instance);
				return wallets;
			} catch (e) {
				dispatch({ type: "failed", message: e.message });
			}

			return wallets;
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
