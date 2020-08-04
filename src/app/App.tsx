import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { ApplicationError } from "domains/error/pages";
import React from "react";
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
	const { env, persist } = useEnvironmentContext();

	React.useLayoutEffect(() => {
		const boot = async () => {
			await env.bootFromObject(fixtureData);
			await persist();
		};

		if (process.env.REACT_APP_BUILD_MODE === "demo") {
			boot();
		}
	}, [env, persist]);

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
	 * Ensure that the Environment object will not be recreated when the state changes, as the data is stored in memory by the `DataRepository`.
	 */

	/* istanbul ignore next */
	const storage = __DEV__ ? new StubStorage() : "indexeddb";
	const [env] = React.useState(() => new Environment({ coins: { ARK }, httpClient, storage }));

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
