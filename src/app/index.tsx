// React
import React from "react";
import { I18nextProvider } from "react-i18next";
import { renderRoutes } from "react-router-config";
import { withRouter } from "react-router-dom";

// Routes
import { routes } from "../router";
import { NavigationBar } from "./components/NavigationBar";
// Context
import { EnvironmentProvider } from "./contexts";
// i18n
import { i18n } from "./i18n";

export const App = withRouter(({ location }: any) => (
	<I18nextProvider i18n={i18n}>
		<main className={process.env.NODE_ENV === "development" ? "debug-screens" : ""}>
			<EnvironmentProvider>
				{location.pathname !== "/" && (
					<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />
				)}
				{renderRoutes(routes)}
			</EnvironmentProvider>
		</main>
	</I18nextProvider>
));
