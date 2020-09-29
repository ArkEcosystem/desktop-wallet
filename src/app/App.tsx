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
import { ToastContainer } from "react-toastify";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { middlewares, RouterView, routes } from "../router";
import { EnvironmentProvider, useEnvironmentContext } from "./contexts";
import { useNetworkStatus } from "./hooks";
import { useEnvSynchronizer } from "./hooks/use-synchronizer";
import { i18n } from "./i18n";
import { httpClient } from "./services";

const __DEV__ = process.env.NODE_ENV !== "production" || process.env.REACT_APP_BUILD_MODE === "demo";

console.log({ env: process.env });

const Main = () => {
	const [showSplash, setShowSplash] = useState(true);

	const { pathname } = useLocation();
	const { env, persist } = useEnvironmentContext();
	const isOnline = useNetworkStatus();
	const { start, runAll } = useEnvSynchronizer();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	useEffect(() => {
		if (!showSplash) {
			start();
		}
	}, [showSplash, start]);

	useLayoutEffect(() => {
		const boot = async () => {
			/* istanbul ignore next */
			await env.verify(__DEV__ || process.env.npm_package_scripts_test_ui_run ? fixtureData : undefined);
			await env.boot();
			await runAll();
			if (!__DEV__) {
				await persist();
			}

			setShowSplash(false);
		};

		boot();
	}, [env, persist, runAll]);

	if (showSplash) {
		return <Splash />;
	}

	/* istanbul ignore next */
	const className = __DEV__ ? "debug-screens" : "";

	return (
		<main className={className}>
			<ToastContainer />

			{isOnline ? <RouterView routes={routes} middlewares={middlewares} /> : <Offline />}
		</main>
	);
};

export const App = () => {
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
					<Main />
				</EnvironmentProvider>
			</I18nextProvider>
		</ErrorBoundary>
	);
};
