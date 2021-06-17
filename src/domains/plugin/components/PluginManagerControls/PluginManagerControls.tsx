import { LayoutControls } from "app/components/LayoutControls";
import React from "react";

interface PluginManagerControlsProperties {
	onSelectGridView: any;
	onSelectListView: any;
	selectedViewType: string;
}

export const PluginManagerControls = ({
	onSelectGridView,
	onSelectListView,
	selectedViewType,
}: PluginManagerControlsProperties) => (
	<div data-testid="PluginManagerControls" className="flex items-center">
		<LayoutControls
			onSelectGridView={onSelectGridView}
			onSelectListView={onSelectListView}
			selectedViewType={selectedViewType}
		/>
	</div>
);

PluginManagerControls.defaultProps = {
	selectedViewType: "grid",
};
