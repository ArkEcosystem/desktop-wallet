// import { ADA } from "@arkecosystem/platform-sdk-ada";
import { ARK } from "@arkecosystem/platform-sdk-ark";
// import { ATOM } from "@arkecosystem/platform-sdk-atom";
// import { BTC } from "@arkecosystem/platform-sdk-btc";
// import { EOS } from "@arkecosystem/platform-sdk-eos";
// import { ETH } from "@arkecosystem/platform-sdk-eth";
import { LSK } from "@arkecosystem/platform-sdk-lsk";
// import { NEO } from "@arkecosystem/platform-sdk-neo";
import { Environment, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
// @ts-ignore
import LedgerTransportNodeHID from "@ledgerhq/hw-transport-node-hid-singleton";
// import { TRX } from "@arkecosystem/platform-sdk-trx";
// import { XLM } from "@arkecosystem/platform-sdk-xlm";
// import { XMR } from "@arkecosystem/platform-sdk-xmr";
// import { XRP } from "@arkecosystem/platform-sdk-xrp";
import { ApplicationError, Offline } from "domains/error/pages";
import { Splash } from "domains/splash/pages";
import electron from "electron";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import { matchPath, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";
import { Theme } from "types";

import { middlewares, RouterView, routes } from "../router";
import { EnvironmentProvider, LedgerProvider, ThemeProvider, useEnvironmentContext, useThemeContext } from "./contexts";
import { useDarkMode, useDeeplink, useEnvSynchronizer, useNetworkStatus } from "./hooks";
import { i18n } from "./i18n";
import { httpClient } from "./services";

const __DEV__ = process.env.NODE_ENV !== "production";

const Main = () => {
	const [showSplash, setShowSplash] = useState(true);
	const location = useLocation();
	const { theme, setTheme } = useThemeContext();
	const { env, persist } = useEnvironmentContext();
	const isOnline = useNetworkStatus();
	const { start, runAll } = useEnvSynchronizer();

	const pathname = (location as any).location?.pathname || location.pathname;
	const nativeTheme = electron.remote.nativeTheme;

	const isDark = useDarkMode();

	useDeeplink();

	useEffect(() => {
		if (!showSplash) {
			start();
		}
	}, [showSplash, start]);

	const match = useMemo(() => matchPath(pathname, { path: "/profiles/:profileId" }), [pathname]);

	useEffect(() => {
		const profileId = (match?.params as any)?.profileId;

		if (profileId && profileId !== "create" && env.profiles().count()) {
			const profileTheme = env.profiles().findById(profileId).settings().get<Theme>(ProfileSetting.Theme)!;
			if (profileTheme !== theme) {
				nativeTheme.themeSource = profileTheme;
				setTheme(profileTheme);
			}
		} else {
			nativeTheme.themeSource = "system";
			setTheme(nativeTheme.shouldUseDarkColors ? "dark" : "light");
		}
	}, [env, match, nativeTheme, theme, setTheme]);

	useLayoutEffect(() => {
		setTheme(nativeTheme.shouldUseDarkColors ? "dark" : "light");
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useLayoutEffect(() => {
		const boot = async () => {
			/* istanbul ignore next */
			const shouldUseFixture = process.env.REACT_APP_BUILD_MODE === "demo";
			await env.verify(shouldUseFixture ? fixtureData : undefined);
			await env.boot();
			await runAll();
			await persist();

			setShowSplash(false);
		};

		boot();
	}, [env, persist, runAll]);

	/* istanbul ignore next */
	const className = __DEV__ ? "debug-screens" : "";

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
		<main className={`theme-${isDark ? "dark" : "light"} ${className}`} data-testid="Main">
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
		<ErrorBoundary FallbackComponent={ApplicationError}>
			<I18nextProvider i18n={i18n}>
				<EnvironmentProvider env={env}>
					<ThemeProvider>
						<LedgerProvider transport={LedgerTransportNodeHID}>
							<Main />
						</LedgerProvider>
					</ThemeProvider>
				</EnvironmentProvider>
			</I18nextProvider>
		</ErrorBoundary>
	);
};
