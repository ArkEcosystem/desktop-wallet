// import { ADA } from "@arkecosystem/platform-sdk-ada";
import { ARK } from "@arkecosystem/platform-sdk-ark";
// import { ATOM } from "@arkecosystem/platform-sdk-atom";
// import { BTC } from "@arkecosystem/platform-sdk-btc";
// import { EOS } from "@arkecosystem/platform-sdk-eos";
// import { ETH } from "@arkecosystem/platform-sdk-eth";
import { LSK } from "@arkecosystem/platform-sdk-lsk";
// import { NEO } from "@arkecosystem/platform-sdk-neo";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
// import { TRX } from "@arkecosystem/platform-sdk-trx";
// import { XLM } from "@arkecosystem/platform-sdk-xlm";
// import { XMR } from "@arkecosystem/platform-sdk-xmr";
// import { XRP } from "@arkecosystem/platform-sdk-xrp";
import { ApplicationError, Offline } from "domains/error/pages";
import { Splash } from "domains/splash/pages";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import { useLocation } from "react-router-dom";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { middlewares, RouterView, routes } from "../router";
import { EnvironmentProvider, useEnvironmentContext } from "./contexts";
import { useNetworkStatus } from "./hooks";
import { i18n } from "./i18n";
import { httpClient, Scheduler } from "./services";

const __DEV__ = process.env.NODE_ENV !== "production";

type Props = {
	syncInterval?: number;
};

const Main = ({ syncInterval }: Props) => {
	const [showSplash, setShowSplash] = useState(true);

	const { pathname } = useLocation();
	const { env, persist } = useEnvironmentContext();
	const isOnline = useNetworkStatus();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	useLayoutEffect(() => {
		const syncDelegates = async () => {
			console.log("Running delegates sync...");
			const coinsData = env.usedCoinsWithNetworks();
			const coinsInUse = Object.keys(coinsData);
			const delegatesPromises: any = [];

			for (const coin of coinsInUse) {
				const coinNetworks = coinsData[coin];
				for (const network of coinNetworks) {
					delegatesPromises.push(Promise.resolve(env.coins().syncDelegates(coin, network)));
				}
			}

			await Promise.allSettled(delegatesPromises);
		};

		const syncWallets = async () => {
			console.log("Running wallet data sync...");
			const profiles = env.profiles().values();

			for (const profile of profiles) {
				const [wallet] = profile.wallets().values();
				try {
					await wallet?.syncVotes();
					await wallet?.syncIdentity();
					await wallet?.syncExchangeRate();

					setShowSplash(false);
				} catch (error) {
					console.error(`Error synchronizing wallet data ${error}`);
					setShowSplash(false);
				}
			}
		};

		const boot = async () => {
			await env.verify(fixtureData);
			await syncDelegates();
			await env.boot();
			await syncWallets();
			await persist();

			Scheduler(syncInterval).schedule([syncDelegates, syncWallets], persist);
		};

		if (process.env.REACT_APP_BUILD_MODE === "demo") {
			boot();
		} else {
			setShowSplash(false);
		}
	}, [env, persist, syncInterval]);

	if (showSplash) {
		return <Splash />;
	}

	/* istanbul ignore next */
	const className = __DEV__ ? "debug-screens" : "";

	return (
		<main className={className}>
			{isOnline ? <RouterView routes={routes} middlewares={middlewares} /> : <Offline />}
		</main>
	);
};

Main.defaultProps = {
	syncInterval: 300000,
};

export const App = ({ syncInterval }: Props) => {
	/**
	 * Ensure that the Environment object will not be recreated when the state changes,
	 * as the data is stored in memory by the `DataRepository`.
	 */

	/* istanbul ignore next */
	const storage = __DEV__ ? new StubStorage() : "indexeddb";
	const [env] = useState(
		() =>
			new Environment({
				coins: {
					// ADA,
					ARK,
					// ATOM,
					// BTC,
					// EOS,
					// ETH,
					LSK,
					// NEO,
					// TRX,
					// XLM,
					// XMR,
					// XRP,
				},
				httpClient,
				storage,
			}),
	);

	return (
		<ErrorBoundary FallbackComponent={ApplicationError}>
			<I18nextProvider i18n={i18n}>
				<EnvironmentProvider env={env}>
					<Main syncInterval={syncInterval} />
				</EnvironmentProvider>
			</I18nextProvider>
		</ErrorBoundary>
	);
};

App.defaultProps = {
	syncInterval: 300000,
};
