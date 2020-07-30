import { LayoutControls } from "app/components/LayoutControls";
import React from "react";

type PluginManagerControlsProps = {
	onSelectGridView: any;
	onSelectListView: any;
	selectedViewType: string;
};

export const PluginManagerControls = ({
	onSelectGridView,
	onSelectListView,
	selectedViewType,
}: PluginManagerControlsProps) => (
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
