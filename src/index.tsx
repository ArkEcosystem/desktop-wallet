// Styles
import "./styles/app.css";

// Context
import { EnvironmentProvider } from "app/contexts";
// React
import React from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import { renderRoutes } from "react-router-config";
import { HashRouter } from "react-router-dom";

// i18n
import { i18n } from "./app/i18n";
// Routes
import { routes } from "./router";

ReactDOM.render(
	<HashRouter>
		<I18nextProvider i18n={i18n}>
			<main className={process.env.NODE_ENV === "development" ? "debug-screens" : ""}>
				<EnvironmentProvider>{renderRoutes(routes)}</EnvironmentProvider>
			</main>
		</I18nextProvider>
	</HashRouter>,
	document.getElementById("root"),
);
