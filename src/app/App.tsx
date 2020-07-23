import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { I18nextProvider } from "react-i18next";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { RouterView, routes } from "../router";
import { EnvironmentProvider, useEnvironmentContext } from "./contexts";
import { useStore } from "./hooks/use-store";
import { i18n } from "./i18n";
import { httpClient } from "./services";

const __DEV__ = process.env.NODE_ENV !== "production";

const Main = () => {
	const { env } = useEnvironmentContext();

	React.useEffect(() => {
		const boot = async () => {
			await env?.bootFromObject(fixtureData);
			await env?.persist();
		};

		if (process.env.REACT_APP_BUILD_MODE === "demo") {
			boot();
		}
	}, [env]);

	/* istanbul ignore next */
	const className = __DEV__ ? "debug-screens" : "";

	return (
		<main className={className}>
			<RouterView routes={routes} />
		</main>
	);
};

export const App = () => {
	/* istanbul ignore next */
	const [storage, state] = useStore(new StubStorage());

	/**
	 * Ensure that the object will not be recreated when the state changes, as the data is stored in memory by the `DataRepository`.
	 */
	const [env] = React.useState(() => new Environment({ coins: { ARK }, httpClient, storage }));

	return (
		<I18nextProvider i18n={i18n}>
			<EnvironmentProvider env={env} state={state}>
				<Main />
			</EnvironmentProvider>
		</I18nextProvider>
	);
};
