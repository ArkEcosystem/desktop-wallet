import { NavigationBar } from "app/components/NavigationBar";
import React from "react";

import { PluginsCategory } from "./PluginsCategory";

export default { title: "Domains / Plugin / Pages / Plugins Category" };

export const Featured = () => (
	<div className="-m-5">
		<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />

		<PluginsCategory title="Featured plugins" description="Easy way to find, manage and install plugins" />
	</div>
);

export const TopRated = () => (
	<div className="-m-5">
		<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />

		<PluginsCategory title="Top Rated plugins" description="Easy way to find, manage and install plugins" />
	</div>
);
