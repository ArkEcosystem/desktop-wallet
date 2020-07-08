import { NavigationBar } from "app/components/NavigationBar";
import React from "react";

import { PluginManager } from "./PluginManager";

export default { title: "Domains / Plugin / Pages / PluginManager" };

export const Default = () => (
	<div className="-m-5">
		<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />

		<PluginManager />
	</div>
);
