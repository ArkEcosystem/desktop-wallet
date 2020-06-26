import React from "react";

import { PluginCard } from "./PluginCard";

export default { title: "Plugins / Components / Plugin Card" };

const plugin = {
	id: "ark-explorer",
	name: "ARK Explorer",
	author: "ARK.io",
	category: "utility",
	rating: 4.2,
	version: "1.3.8",
	size: "4.2 MB",
	isInstalled: false,
	isOfficial: true,
};

export const Default = () => (
	<div className="flex">
		<PluginCard plugin={plugin} onClick={() => alert("clicked plugin")} onDelete={() => alert("delete plugin")} />
	</div>
);
