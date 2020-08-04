import "./styles/app.css";

// @ts-ignore - Missing Types
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { App } from "app";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

if (process.env.NODE_ENV && ["development", "production"].includes(process.env.NODE_ENV)) {
	disableReactDevTools();
}

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById("root"),
);
