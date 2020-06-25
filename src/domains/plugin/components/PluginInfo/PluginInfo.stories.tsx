import React from "react";

import { PluginInfo } from "./PluginInfo";

export default { title: "Plugins / Components / Plugin Info" };

export const Default = () => (
	<PluginInfo
		about="Use the ARK Explorer to get full visibility of critical data from the ARK network. Data such as the latest blocks, wallet addresses and transactions. Plus monitor delegate status, their position and more."
		permissions={["Embedded Webpages", "API Requests", "Access to Profiles"]}
		screenshots={[1, 2, 3]}
	/>
);
