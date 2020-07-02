// Platform SDK
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
// React
import { ARK } from "@arkecosystem/platform-sdk-ark";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { renderRoutes } from "react-router-config";
import { withRouter } from "react-router-dom";

// Routes
import { routes } from "../router";
// Fixtures
import { identity } from "../tests/fixtures/identity";
// UI Elements
import { NavigationBar } from "./components/NavigationBar";
// Context
import { EnvironmentConsumer, EnvironmentProvider } from "./contexts";
// i18n
import { i18n } from "./i18n";

const routesWithoutNavBar = ["/", "s/create"];

const buildMockEnvironment = async (env: Environment) => {
	const profile = env.profiles().create("Anne Doe");
	await profile.wallets().import(identity.mnemonic, ARK, "devnet");

	env.persist();
};

const buildMockEnvironment = async (env: any) => {
	const profile = env.profiles().create("Anne Doe");
	await profile.wallets().import(identity.mnemonic, ARK, "devnet");

	env.persist();
};

export const App = withRouter(({ location }: any) => (
	<I18nextProvider i18n={i18n}>
		<main className={process.env.NODE_ENV === "development" ? "debug-screens" : ""}>
			<EnvironmentProvider>
				<EnvironmentConsumer>
					{({ env }: any) => {
						if (process.env.REACT_APP_BUILD_MODE === "demo") buildMockEnvironment(env);

						return (
							<>
								{!routesWithoutNavBar.includes(location.pathname) && (
									<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />
								)}
								{renderRoutes(routes)}
							</>
						);
					}}
				</EnvironmentConsumer>
			</EnvironmentProvider>
		</main>
	</I18nextProvider>
));
