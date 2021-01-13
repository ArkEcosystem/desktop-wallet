// import { ADA } from "@arkecosystem/platform-sdk-ada";
import { ARK } from "@arkecosystem/platform-sdk-ark";
// import { ATOM } from "@arkecosystem/platform-sdk-atom";
// import { BTC } from "@arkecosystem/platform-sdk-btc";
// import { EOS } from "@arkecosystem/platform-sdk-eos";
// import { ETH } from "@arkecosystem/platform-sdk-eth";
import { LSK } from "@arkecosystem/platform-sdk-lsk";
// import { NEO } from "@arkecosystem/platform-sdk-neo";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
// @ts-ignore
import LedgerTransportNodeHID from "@ledgerhq/hw-transport-node-hid-singleton";
// import { TRX } from "@arkecosystem/platform-sdk-trx";
// import { XLM } from "@arkecosystem/platform-sdk-xlm";
// import { XMR } from "@arkecosystem/platform-sdk-xmr";
// import { XRP } from "@arkecosystem/platform-sdk-xrp";
import { ApplicationError, Offline } from "domains/error/pages";
import { Splash } from "domains/splash/pages";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import { ToastContainer } from "react-toastify";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";
import { setThemeSource, shouldUseDarkColors } from "utils/electron-utils";

import { middlewares, RouterView, routes } from "../router";
import { ConfigurationProvider, EnvironmentProvider, LedgerProvider, useEnvironmentContext } from "./contexts";
import { useDeeplink, useEnvSynchronizer, useNetworkStatus } from "./hooks";
import { i18n } from "./i18n";
import { httpClient } from "./services";

const __DEV__ = process.env.NODE_ENV !== "production";

const Main = () => {
	const [showSplash, setShowSplash] = useState(true);
	const { env, persist } = useEnvironmentContext();
	const isOnline = useNetworkStatus();
	const { start, runAll } = useEnvSynchronizer();

	useDeeplink();

	useEffect(() => {
		if (!showSplash) {
			start();
		}
	}, [showSplash, start]);

	useLayoutEffect(() => {
		setThemeSource("system");

		document.body.classList.remove(`theme-${shouldUseDarkColors() ? "light" : "dark"}`);
		document.body.classList.add(`theme-${shouldUseDarkColors() ? "dark" : "light"}`);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleError = useErrorHandler();

	useLayoutEffect(() => {
		const boot = async () => {
			/* istanbul ignore next */
			const shouldUseFixture = process.env.REACT_APP_BUILD_MODE === "demo";

			try {
				await env.verify(shouldUseFixture ? fixtureData : undefined);
				await env.boot();
				await runAll();
				await persist();
			} catch (error) {
				handleError(error);
			}

			setShowSplash(false);
		};

		boot();
	}, [env, handleError, persist, runAll]);

	const renderContent = () => {
		if (showSplash) {
			return <Splash />;
		}

		if (!isOnline) {
			return <Offline />;
		}

		return <RouterView routes={routes} middlewares={middlewares} />;
	};

	return (
		<main data-testid="Main">
			<ToastContainer newestOnTop />

			{renderContent()}
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
		<I18nextProvider i18n={i18n}>
			<EnvironmentProvider env={env}>
				<ConfigurationProvider>
					<ErrorBoundary FallbackComponent={ApplicationError}>
						<LedgerProvider transport={LedgerTransportNodeHID}>
							<Main />
						</LedgerProvider>
					</ErrorBoundary>
				</ConfigurationProvider>
			</EnvironmentProvider>
		</I18nextProvider>
	);
};
