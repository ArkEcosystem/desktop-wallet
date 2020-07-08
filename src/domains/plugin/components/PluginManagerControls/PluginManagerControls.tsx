import { Dropdown } from "app/components/Dropdown";
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
}: PluginManagerControlsProps) => {
	return (
		<div data-testid="PluginManagerControls" className="flex items-center mx-4">
			<div className="flex items-center pr-4 mr-6 border-r border-theme-primary-contrast">
				<LayoutControls
					onSelectGridView={onSelectGridView}
					onSelectListView={onSelectListView}
					selectedViewType={selectedViewType}
				/>
			</div>

			<div className="relative inline-block text-theme-primary-400">
				<Dropdown toggleIcon="Filters">
					<div className="py-8 w-128 px-11" />
				</Dropdown>
			</div>
		</div>
	);
};

PluginManagerControls.defaultProps = {
	selectedViewType: "grid",
};
