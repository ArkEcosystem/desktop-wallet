// import { ADA } from "@arkecosystem/platform-sdk-ada";
import { ARK } from "@arkecosystem/platform-sdk-ark";
// import { ATOM } from "@arkecosystem/platform-sdk-atom";
// import { BTC } from "@arkecosystem/platform-sdk-btc";
// import { EOS } from "@arkecosystem/platform-sdk-eos";
// import { ETH } from "@arkecosystem/platform-sdk-eth";
import { LSK } from "@arkecosystem/platform-sdk-lsk";
// import { NEO } from "@arkecosystem/platform-sdk-neo";
import { Environment, Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
// @ts-ignore
import LedgerTransportNodeHID from "@ledgerhq/hw-transport-node-hid-singleton";
// import { TRX } from "@arkecosystem/platform-sdk-trx";
// import { XLM } from "@arkecosystem/platform-sdk-xlm";
// import { XMR } from "@arkecosystem/platform-sdk-xmr";
// import { XRP } from "@arkecosystem/platform-sdk-xrp";
import { ApplicationError, Offline } from "domains/error/pages";
import { Splash } from "domains/splash/pages";
import { LedgerListener } from "domains/transaction/components/LedgerListener";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import { matchPath, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";
import { shouldUseDarkColors } from "utils/electron-utils";

import { middlewares, RouterView, routes } from "../router";
import { EnvironmentProvider, ThemeProvider, useEnvironmentContext, useThemeContext } from "./contexts";
import { useNetworkStatus } from "./hooks";
import { useEnvSynchronizer } from "./hooks/use-synchronizer";
import { i18n } from "./i18n";
import { httpClient } from "./services";

const __DEV__ = process.env.NODE_ENV !== "production";

const Main = () => {
	const [showSplash, setShowSplash] = useState(true);
	const [profile, setProfile] = useState<Profile | undefined>();

	const { theme, setTheme } = useThemeContext();
	const { pathname } = useLocation();
	const { env, persist } = useEnvironmentContext();
	const isOnline = useNetworkStatus();
	const { start, runAll } = useEnvSynchronizer();

	const setSystemTheme = useCallback(() => {
		setTheme(shouldUseDarkColors() ? "dark" : "light");
	}, [setTheme]);

	const match = useMemo(() => matchPath(pathname, { path: "/profiles/:profileId" }), [pathname]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	useEffect(() => {
		if (!showSplash) {
			start();
		}
	}, [showSplash, start]);

	useEffect(() => {
		try {
			setProfile(env.profiles().findById((match?.params as any)?.profileId));
		} catch {
			setProfile(undefined);
		}
	}, [env, match, pathname]);

	useEffect(() => {
		if (profile) {
			const profileTheme = profile.settings().get(ProfileSetting.Theme);
			profileTheme !== theme && setTheme(profileTheme);
		} else {
			setSystemTheme();
		}
	}, [profile, pathname, setTheme, setSystemTheme]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useLayoutEffect(() => setSystemTheme(), []);

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
		<main className={`theme-${theme} ${className}`}>
			<ToastContainer />

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
					<LedgerListener transport={LedgerTransportNodeHID} />

					<ThemeProvider>
						<Main />
					</ThemeProvider>
				</EnvironmentProvider>
			</I18nextProvider>
		</ErrorBoundary>
	);
};
