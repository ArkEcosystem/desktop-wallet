import React from "react";

import { PluginList } from "./PluginList";

export default { title: "Domains / Plugin / Components / PluginList" };

const plugins = [
	{
		id: "ark-explorer",
		name: "ARK Explorer",
		author: "ARK.io",
		category: "utility",
		rating: 4.2,
		version: "1.3.8",
		size: "4.2 MB",
		isInstalled: false,
		isOfficial: true,
	},
	{
		id: "ark-avatars",
		name: "ARK Avatars",
		author: "ARK.io",
		category: "other",
		rating: 3.8,
		version: "1.3.8",
		size: "163 KB",
		isInstalled: true,
		isGrant: true,
	},
];

export const Default = () => (
	<PluginList
		plugins={[
			...plugins,
			...plugins,
			...plugins,
			...plugins,
			...plugins,
			...plugins,
			...plugins,
			...plugins,
			...plugins,
			...plugins,
		]}
		onInstall={(plugin: any) => alert(`selected ${plugin.name} plugin`)}
		onDelete={(plugin: any) => alert(`delete ${plugin.name} plugin`)}
		itemsPerPage={8}
	/>
);
