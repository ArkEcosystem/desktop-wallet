import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { StubStorage } from "tests/mocks";

import { RouterView, routes } from "../router";
import { identity } from "../tests/fixtures/identity";
import { EnvironmentProvider, useEnvironment } from "./contexts";
import { i18n } from "./i18n";
import { httpClient } from "./services";

const __DEV__ = process.env.NODE_ENV !== "production";

const buildMockEnvironment = async (env: Environment) => {
	const profile = env.profiles().create("Anne Doe");

	await profile.wallets().import(identity.mnemonic, ARK, "devnet");
};

const Main = () => {
	const env = useEnvironment();

	React.useLayoutEffect(() => {
		if (process.env.REACT_APP_BUILD_MODE === "demo") {
			buildMockEnvironment(env!);
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
	const storage = __DEV__ ? new StubStorage() : "indexeddb";
	const env = new Environment({ coins: { ARK }, httpClient, storage });

	return (
		<I18nextProvider i18n={i18n}>
			<EnvironmentProvider env={env}>
				<Main />
			</EnvironmentProvider>
		</I18nextProvider>
	);
};
