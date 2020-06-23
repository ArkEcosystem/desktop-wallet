import React from "react";

import { PluginListItem } from "./PluginListItem";

export default { title: "Plugins / components / Plugin List Item" };

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
	<table className="w-full table-auto">
		<tbody>
			<PluginListItem plugin={plugins[0]} />
			<PluginListItem plugin={plugins[1]} />
		</tbody>
	</table>
);
