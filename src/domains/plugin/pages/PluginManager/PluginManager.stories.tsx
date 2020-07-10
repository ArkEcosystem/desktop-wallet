import { NavigationBar } from "app/components/NavigationBar";
import React from "react";

import { PluginManager } from "./PluginManager";

export default { title: "Domains / Plugin / Pages / PluginManager" };

export const Default = () => {
	const paths = {
		featured: "/?path=/story/domains-plugin-pages-plugins-category--featured",
		topRated: "/?path=/story/domains-plugin-pages-plugins-category--top-rated",
	};

	return (
		<div className="-m-5">
			<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />

			<PluginManager paths={paths} />
		</div>
	);
};
