// Styles
import "./styles/app.css";

import { App } from "app";
// React
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

ReactDOM.render(
	<HashRouter>
		<App />
	</HashRouter>,
	document.getElementById("root"),
);
