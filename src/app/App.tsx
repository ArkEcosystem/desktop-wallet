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
import { PluginManagerWrapper, usePluginManager } from "plugins/use-manager";
import React, { useLayoutEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { middlewares, RouterView, routes } from "../router";
import { EnvironmentProvider, useEnvironmentContext } from "./contexts";
import { useNetworkStatus } from "./hooks";
import { i18n } from "./i18n";
import { httpClient } from "./services";

const __DEV__ = process.env.NODE_ENV !== "production";

const Main = () => {
	const [showSplash, setShowSplash] = useState(true);

	const { env, persist } = useEnvironmentContext();

	const isOnline = useNetworkStatus();
	const pluginManager = usePluginManager();

	useLayoutEffect(() => {
		const bootEnvrionment = async () => {
			await env.bootFromObject(fixtureData);
			await persist();
		};

		const bootPlugins = async () => {
			await pluginManager.boot();
		};

		const promises = [bootPlugins()];

		if (process.env.REACT_APP_BUILD_MODE === "demo") {
			promises.push(bootEnvrionment());
		}

		Promise.all(promises).then(() => setShowSplash(false));
	}, [env, persist, pluginManager]);

	if (showSplash) {
		return <Splash />;
	}

	/* istanbul ignore next */
	const className = __DEV__ ? "debug-screens" : "";

	/**
	 * TODO: cannot be verified if the current profile enabled the plugin
	 * because the url parameters are not accessible. Then all routes are registered
	 * and a middleware will validate.
	 */
	const pluginsRoutes = pluginManager.services().route.all();
	const allRoutes = [...pluginsRoutes, ...routes];

	return (
		<main className={className}>
			{isOnline ? (
				<RouterView
					routes={allRoutes}
					middlewares={middlewares}
					wrapper={(props) => <PluginManagerWrapper pluginManager={pluginManager} {...props} />}
				/>
			) : (
				<Offline />
			)}
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
				<ErrorBoundary FallbackComponent={ApplicationError}>
					<Main />
				</ErrorBoundary>
			</EnvironmentProvider>
		</I18nextProvider>
	);
};
