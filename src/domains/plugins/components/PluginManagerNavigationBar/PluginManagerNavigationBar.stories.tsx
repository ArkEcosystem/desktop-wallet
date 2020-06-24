import React from "react";

import { PluginManagerNavigationBar } from "./PluginManagerNavigationBar";

export default { title: "Plugins / components / Plugin Manager Navigation" };

export const Default = () => {
	const [currentView, setCurrentView] = React.useState("home");

	return <PluginManagerNavigationBar selected={currentView} onChange={setCurrentView} />;
};
