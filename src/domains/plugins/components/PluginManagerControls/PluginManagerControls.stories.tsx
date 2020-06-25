import React from "react";

import { PluginManagerControls } from "./PluginManagerControls";

export default { title: "Plugins / components / Plugin Manager Controls" };

export const Default = () => {
	const [viewType, setViewType] = React.useState("grid");

	return (
		<div className="flex justify-end">
			<PluginManagerControls
				selectedViewType={viewType}
				onSelectListView={() => setViewType("list")}
				onSelectGridView={() => setViewType("grid")}
			/>
		</div>
	);
};
