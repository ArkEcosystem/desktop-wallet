import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { IntlProvider } from "react-intl";

// i18n
import translations from "./i18n/locales";
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
			messages={translations["en-US"].messages}
		>
			{renderRoutes(routes)}
		</IntlProvider>
	</HashRouter>,
	document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
