import { Coins } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import Transport from "@ledgerhq/hw-transport";
import retry from "async-retry";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

import { useEnvironmentContext } from "../../Environment";
import { formatLedgerDerivationPath, LedgerData } from "../utils";
import { connectionReducer, defaultConnectionState } from "./connection.state";

export const useLedgerConnection = (transport: typeof Transport) => {
	const { persist } = useEnvironmentContext();
	const [state, dispatch] = useReducer(connectionReducer, defaultConnectionState);
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
		async (wallets: LedgerData[], coin: Coins.Coin, profile: Contracts.IProfile) => {
			for (const { address, path } of wallets) {
				const wallet = await profile.walletFactory().fromAddressWithLedgerPath({
					address,
					coin: coin.network().coin(),
					network: coin.network().id(),
					path,
				});

				profile.wallets().push(wallet);
			}
			await persist();
		},
		[persist],
	);

	const connect = useCallback(
		async (
			profile: Contracts.IProfile,
			coin: string,
			network: string,
			retryOptions: retry.Options = { retries: 50, randomize: false, factor: 1 },
		) => {
			dispatch({ type: "waiting" });
			abortRetryRef.current = false;

			const instance = profile.coins().set(coin, network);

			try {
				const slip44 = instance.config().get<number>("network.crypto.slip44");

				const connectFn: retry.RetryFunction<void> = async (bail, attempts) => {
					if (abortRetryRef.current && attempts > 1) {
						bail(new Error("User aborted"));
					}

					await instance.__construct();
					await instance.ledger().connect(transport);
					// Ensure that the app is accessible
					await instance.ledger().getPublicKey(formatLedgerDerivationPath({ coinType: slip44 }));
				};

				await retry(connectFn, retryOptions);
				dispatch({ type: "connected" });
			} catch (connectError) {
				try {
					await instance.ledger().disconnect();
				} catch {
					//
				}
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

	const setBusy = useCallback(() => dispatch({ type: "busy" }), []);
	const setIdle = useCallback(() => dispatch({ type: "connected" }), []);

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
		dispatch,
		error,
		setBusy,
		setIdle,
		hasDeviceAvailable,
		importLedgerWallets,
		isAwaitingConnection,
		isAwaitingDeviceConfirmation,
		isBusy,
		isConnected,
		transport,
	};
};
