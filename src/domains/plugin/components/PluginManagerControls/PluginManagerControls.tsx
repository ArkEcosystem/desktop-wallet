
import { Divider } from "app/components/Divider";
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
			<LayoutControls
				onSelectGridView={onSelectGridView}
				onSelectListView={onSelectListView}
				selectedViewType={selectedViewType}
			/>

			<Divider type="vertical" />

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
