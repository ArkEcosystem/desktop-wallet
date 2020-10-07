import { Coins } from "@arkecosystem/platform-sdk";
import { Profile, WalletFlag } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Transport from "@ledgerhq/hw-transport";
import retry from "async-retry";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

import { useEnvironmentContext } from "../Environment";
import { defaultLedgerState, ledgerStateReducer } from "./Ledger.state";

const formatDerivationPath = (coinType: number, index: number) => `44'/${coinType}'/${index}'/0/0`;

export const useLedger = (transport: typeof Transport) => {
	const { persist } = useEnvironmentContext();
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
		async (wallets: { address: string; index: number }[], coin: Coins.Coin, profile: Profile) => {
			for (const { address, index } of wallets) {
				const wallet = await profile
					.wallets()
					.importByAddress(address, coin.network().coin(), coin.network().id());
				wallet.data().set(WalletFlag.Ledger, index);
			}
			await persist();
		},
		[persist],
	);

	const connect = useCallback(
		async (coin: Coins.Coin, retryOptions: retry.Options = { retries: 50, randomize: false, factor: 1 }) => {
			dispatch({ type: "waiting" });
			abortRetryRef.current = false;

			try {
				const slip44 = coin.config().get<number>("network.crypto.slip44");

				const connectFn: retry.RetryFunction<void> = async (bail, attempts) => {
					if (abortRetryRef.current && attempts > 1) {
						bail(new Error("User aborted"));
					}

					await coin.ledger().connect(transport);
					// Ensure that the app is accessible
					await coin.ledger().getPublicKey(formatDerivationPath(slip44, 0));
				};

				await retry(connectFn, retryOptions);
				dispatch({ type: "connected" });
			} catch (connectError) {
				coin.ledger().disconnect();
				dispatch({ type: "failed", message: connectError.message });
				throw connectError;
			}
		},
		[transport],
	);

	const disconnect = useCallback(async (coin: Coins.Coin) => {
		await coin.ledger().disconnect();
		dispatch({ type: "disconnected" });
	}, []);

	const scanWallets = useCallback(
		async (coin: Coins.Coin, profile: Profile) => {
			const slip44 = coin.config().get<number>("network.crypto.slip44");
			const wallets: { address: string; balance: BigNumber; index: number }[] = [];

			try {
				await connect(coin);

				dispatch({ type: "busy" });

				let hasMore = true;
				let cursor = 0;

				while (hasMore) {
					const path = formatDerivationPath(slip44, cursor);
					const publicKey = await coin.ledger().getPublicKey(path);
					const address = await coin.identity().address().fromPublicKey(publicKey);

					// Already imported
					if (profile.wallets().findByPublicKey(publicKey)) {
						cursor++;
						continue;
					}

					try {
						const identity = await coin.client().wallet(address);

						wallets.push({
							address: identity.address(),
							balance: identity.balance(),
							index: cursor,
						});
					} catch {
						// New Cold Wallet
						wallets.push({
							address,
							balance: BigNumber.ZERO,
							index: cursor,
						});
						hasMore = false;
					}

					cursor++;
				}

				await disconnect(coin);
				return wallets;
			} catch (e) {
				dispatch({ type: "failed", message: e.message });
			}

			return wallets;
		},
		[connect, disconnect],
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
		importLedgerWallets,
	};
};
