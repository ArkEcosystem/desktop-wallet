import { ARK } from "@arkecosystem/platform-sdk-ark";
import { LSK } from "@arkecosystem/platform-sdk-lsk";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { ApplicationError } from "domains/error/pages";
import { Splash } from "domains/splash/pages";
import { LedgerListener } from "domains/transaction/components/LedgerListener";
import React, { useLayoutEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { middlewares, RouterView, routes } from "../router";
import { EnvironmentProvider, useEnvironmentContext } from "./contexts";
import { i18n } from "./i18n";
import { httpClient } from "./services";

const __DEV__ = process.env.NODE_ENV !== "production";

const Main = () => {
	const [showSplash, setShowSplash] = useState(true);

	const { env, persist } = useEnvironmentContext();

	useLayoutEffect(() => {
		const boot = async () => {
			await env.bootFromObject(fixtureData);
			setShowSplash(false);
			await persist();
		};

		if (process.env.REACT_APP_BUILD_MODE === "demo") {
			boot();
		}
	}, [env, persist]);

	if (showSplash) return <Splash />;

	/* istanbul ignore next */
	const className = __DEV__ ? "debug-screens" : "";

	return (
		<main className={className}>
			<RouterView routes={routes} middlewares={middlewares} />
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
	const [env] = useState(() => new Environment({ coins: { ARK, LSK }, httpClient, storage }));

	return (
		<I18nextProvider i18n={i18n}>
			<EnvironmentProvider env={env}>
				<ErrorBoundary FallbackComponent={ApplicationError}>
					<LedgerListener />

					<Main />
				</ErrorBoundary>
			</EnvironmentProvider>
		</I18nextProvider>
	);
};
