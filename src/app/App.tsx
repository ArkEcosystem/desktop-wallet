import "focus-visible";

// import { ADA } from "@arkecosystem/platform-sdk-ada";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { ATOM } from "@arkecosystem/platform-sdk-atom";
import { AVAX } from "@arkecosystem/platform-sdk-avax";
import { BTC } from "@arkecosystem/platform-sdk-btc";
import { DOT } from "@arkecosystem/platform-sdk-dot";
import { EGLD } from "@arkecosystem/platform-sdk-egld";
import { ETH } from "@arkecosystem/platform-sdk-eth";
import { LSK } from "@arkecosystem/platform-sdk-lsk";
import { LUNA } from "@arkecosystem/platform-sdk-luna";
import { NANO } from "@arkecosystem/platform-sdk-nano";
import { NEO } from "@arkecosystem/platform-sdk-neo";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { TRX } from "@arkecosystem/platform-sdk-trx";
import { XLM } from "@arkecosystem/platform-sdk-xlm";
import { XRP } from "@arkecosystem/platform-sdk-xrp";
import { ZIL } from "@arkecosystem/platform-sdk-zil";
// @ts-ignore
import LedgerTransportNodeHID from "@ledgerhq/hw-transport-node-hid-singleton";
import { Offline } from "domains/error/pages";
import { Splash } from "domains/splash/pages";
import { usePluginManagerContext } from "plugins";
import { PluginRouterWrapper } from "plugins/components/PluginRouterWrapper";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { StubStorage } from "tests/mocks";
import { setThemeSource, shouldUseDarkColors } from "utils/electron-utils";
import { bootEnvWithProfileFixtures, isE2E, isUnit } from "utils/test-helpers";

import { middlewares, RouterView, routes } from "../router";
import { ConfigurationProvider, EnvironmentProvider, LedgerProvider, useEnvironmentContext } from "./contexts";
import { useDeeplink, useEnvSynchronizer, useNetworkStatus, useProfileSynchronizer } from "./hooks";
import { i18n } from "./i18n";
import { PluginProviders } from "./PluginProviders";
import { SentryProvider } from "./sentry/SentryProvider";
import { SentryRouterWrapper } from "./sentry/SentryRouterWrapper";
import { httpClient } from "./services";

const RouteWrappers = ({ children }: { children: React.ReactNode }) => (
	<SentryRouterWrapper>
		<PluginRouterWrapper>{children}</PluginRouterWrapper>
	</SentryRouterWrapper>
);

const Main = () => {
	const [showSplash, setShowSplash] = useState(true);
	const { env } = useEnvironmentContext();
	const { loadPlugins } = usePluginManagerContext();
	const isOnline = useNetworkStatus();
	const { start } = useEnvSynchronizer();
	const history = useHistory();

	useProfileSynchronizer({
		onProfileRestoreError: () => history.push("/"),
	});

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
	}, []);

	const handleError = useErrorHandler();

	useLayoutEffect(() => {
		const boot = async () => {
			try {
				/* istanbul ignore next */
				if (isE2E() || isUnit()) {
					await bootEnvWithProfileFixtures({ env, shouldRestoreDefaultProfile: isUnit() });

					loadPlugins();
					setShowSplash(false);
					return;
				}

				/* istanbul ignore next */
				await env.verify();
				/* istanbul ignore next */
				await env.boot();
				/* istanbul ignore next */
				await loadPlugins();
			} catch (error) {
				handleError(error);
			}

			setShowSplash(false);
		};

		boot();
	}, [env, handleError, loadPlugins]);

	const renderContent = () => {
		if (showSplash) {
			return <Splash />;
		}

		if (!isOnline) {
			return <Offline />;
		}

		return <RouterView routes={routes} middlewares={middlewares} wrapper={RouteWrappers} />;
	};

	return (
		<main data-testid="Main">
			<ToastContainer closeOnClick={false} newestOnTop />

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
	const storage = isE2E() || isUnit() ? new StubStorage() : "indexeddb";

	const [env] = useState(
		() =>
			new Environment({
				coins: {
					// ADA,
					ARK,
					ATOM,
					AVAX,
					BTC,
					DOT,
					ETH,
					EGLD,
					LSK,
					NEO,
					NANO,
					LUNA,
					TRX,
					XLM,
					XRP,
					ZIL,
				},
				httpClient,
				storage,
			}),
	);

	return (
		<I18nextProvider i18n={i18n}>
			<EnvironmentProvider env={env}>
				<ConfigurationProvider>
					<SentryProvider>
						<LedgerProvider transport={LedgerTransportNodeHID}>
							<PluginProviders>
								<Main />
							</PluginProviders>
						</LedgerProvider>
					</SentryProvider>
				</ConfigurationProvider>
			</EnvironmentProvider>
		</I18nextProvider>
	);
};
