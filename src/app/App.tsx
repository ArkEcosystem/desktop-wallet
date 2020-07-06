import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { RouterView, routes } from "../router";
import { identity } from "../tests/fixtures/identity";
import { Layout } from "./components/Layout";
import { AppContextProvider, EnvironmentProvider, useEnvironment } from "./contexts";
import { i18n } from "./i18n";

const buildMockEnvironment = async (env: Environment) => {
	const profile = env.profiles().create("Anne Doe");
	await profile.wallets().import(identity.mnemonic, ARK, "devnet");

	env.persist();
};

const Main = () => {
	const env = useEnvironment();

	React.useLayoutEffect(() => {
		if (process.env.REACT_APP_BUILD_MODE === "demo") {
			buildMockEnvironment(env!);
		}
	}, [env]);

	return (
		<main className={process.env.NODE_ENV === "development" ? "debug-screens" : ""}>
			<RouterView routes={routes} wrapper={Layout} />
		</main>
	);
};

export const App = () => (
	<I18nextProvider i18n={i18n}>
		<AppContextProvider>
			<EnvironmentProvider>
				<Main />
			</EnvironmentProvider>
		</AppContextProvider>
	</I18nextProvider>
);
