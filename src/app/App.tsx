// import { ADA } from "@arkecosystem/platform-sdk-ada";
import { ARK } from "@arkecosystem/platform-sdk-ark";
// import { ATOM } from "@arkecosystem/platform-sdk-atom";
// import { BTC } from "@arkecosystem/platform-sdk-btc";
// import { EOS } from "@arkecosystem/platform-sdk-eos";
// import { ETH } from "@arkecosystem/platform-sdk-eth";
import { LSK } from "@arkecosystem/platform-sdk-lsk";
// import { NEO } from "@arkecosystem/platform-sdk-neo";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { URIService } from "@arkecosystem/platform-sdk/dist/coins";
// @ts-ignore
import LedgerTransportNodeHID from "@ledgerhq/hw-transport-node-hid-singleton";
// import { TRX } from "@arkecosystem/platform-sdk-trx";
// import { XLM } from "@arkecosystem/platform-sdk-xlm";
// import { XMR } from "@arkecosystem/platform-sdk-xmr";
// import { XRP } from "@arkecosystem/platform-sdk-xrp";
import { getDeeplinkRoute, toasts } from "app/services";
import { ApplicationError, Offline } from "domains/error/pages";
import { Splash } from "domains/splash/pages";
import { LedgerListener } from "domains/transaction/components/LedgerListener";
import { ipcRenderer } from "electron";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { middlewares, RouterView, routes } from "../router";
import { EnvironmentProvider, useEnvironmentContext } from "./contexts";
import { useNetworkStatus } from "./hooks";
import { useEnvSynchronizer } from "./hooks/use-synchronizer";
import { i18n } from "./i18n";
import { httpClient } from "./services";

const __DEV__ = process.env.NODE_ENV !== "production";

const Main = () => {
	const uriService = new URIService();
	const [showSplash, setShowSplash] = useState(true);
	const { pathname, state } = useLocation();
	const { env, persist } = useEnvironmentContext();
	const isOnline = useNetworkStatus();
	const { start, runAll } = useEnvSynchronizer();
	const { t } = useTranslation();
	const history = useHistory();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	useEffect(() => {
		if (!showSplash) {
			start();
		}
	}, [showSplash, start]);

	useEffect(() => {
		ipcRenderer.on("process-url", (_, url) => {
			if (history.location.pathname === "/") return toasts.warning(t("COMMON.SELECT_A_PROFILE"));

			if (history.location.pathname.includes("/dashboard")) return toasts.warning(t("COMMON.SELECT_A_WALLET"));

			const urlParts = history.location.pathname.split("/");
			const activeSession = {
				profileId: urlParts[2],
				walletId: urlParts[4],
			};

			const deeplinkSchema = uriService.deserialize(url);

			return history.replace(getDeeplinkRoute(activeSession)[deeplinkSchema.method], deeplinkSchema);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [history.location.pathname]);

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
					<LedgerListener transport={LedgerTransportNodeHID} />
					<Main />
				</EnvironmentProvider>
			</I18nextProvider>
		</ErrorBoundary>
	);
};
