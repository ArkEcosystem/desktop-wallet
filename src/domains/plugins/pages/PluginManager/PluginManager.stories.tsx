import { NavigationBar } from "app/components/NavigationBar";
import React from "react";

import { PluginManager } from "./PluginManager";

export default { title: "Plugins / Pages / Plugin Manager" };

export const Default = () => (
	<div>
		<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />

		<PluginManager />
	</div>
);
