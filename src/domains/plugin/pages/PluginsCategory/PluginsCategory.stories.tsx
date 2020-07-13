import React from "react";

import { PluginsCategory } from "./PluginsCategory";

export default { title: "Domains / Plugin / Pages / Plugins Category" };

export const Featured = () => (
	<PluginsCategory title="Featured plugins" description="Easy way to find, manage and install plugins" />
);

export const TopRated = () => (
	<PluginsCategory title="Top Rated plugins" description="Easy way to find, manage and install plugins" />
);
