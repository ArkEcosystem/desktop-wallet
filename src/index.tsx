import "./styles/app.css";

import { App } from "app";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// Based on https://github.com/fvilers/disable-react-devtools.
if (process.env.NODE_ENV && ["development", "production"].includes(process.env.NODE_ENV)) {
	const isFunction = (value: unknown): boolean => typeof value == "function" || false;
	const isObject = (value: unknown): boolean => typeof value === "function" || (typeof value === "object" && !!value);

	// @ts-ignore
	if (isObject(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
		// @ts-ignore
		for (const prop in window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
			// @ts-ignore
			window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] = isFunction(window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop])
				? Function.prototype
				: null;
		}
	}
}

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById("root"),
);
