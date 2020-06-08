import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { IntlProvider } from "react-intl";

// i18n
import { locales } from "./i18n/locales";
// Routes
import { routes } from "./router";
// Styles
import "./styles/app.css";

const locale = "en-US";

ReactDOM.render(
	<HashRouter>
		<IntlProvider
			locale={locale}
			// @ts-ignore
			messages={locales["en-US"].messages}
		>
			<main className={process.env.NODE_ENV === "development" ? "debug-screens" : ""}>
				{renderRoutes(routes)}
			</main>
		</IntlProvider>
	</HashRouter>,
	document.getElementById("root"),
);
