import React from "react";

import { PluginManagerNavigationBar } from "./PluginManagerNavigationBar";

export default { title: "Domains / Plugin / Components / PluginManagerNavigation" };

export const Default = () => {
	const [currentView, setCurrentView] = React.useState("home");

	return <PluginManagerNavigationBar installedPluginsCount={0} selected={currentView} onChange={setCurrentView} />;
};
