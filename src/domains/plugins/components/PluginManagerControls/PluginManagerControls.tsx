import { Icon } from "app/components//Icon";
import { Dropdown } from "app/components/Dropdown";
import React, { useState } from "react";

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
	const [walletsViewType, setWalletsViewType] = useState(selectedViewType);

	const getViewTypeIconClass = (viewType: any) => {
		return selectedViewType === viewType
			? "text-theme-danger-300 border-theme-danger-100"
			: "text-theme-primary-400 border-theme-background";
	};

	return (
		<div data-testid="PluginManagerControls" className="flex items-center mx-4">
			<div data-testid="PluginManagerControls__grid" className={`inline-block`}>
				<div
					data-testid="PluginManagerControls__grid--icon"
					className={`px-2 py-2 h-full border-b-2 cursor-pointer ${getViewTypeIconClass("grid")}`}
					onClick={onSelectGridView}
				>
					<Icon name="Grid" width={20} height={20} />
				</div>
			</div>

			<div
				data-testid="PluginManagerControls__list"
				className={`pr-5 mr-7 border-r border-theme-neutral-200 inline-block`}
			>
				<div
					data-testid="PluginManagerControls__list--icon"
					className={`px-2 py-2 h-full border-b-2 cursor-pointer ${getViewTypeIconClass("list")}`}
					onClick={onSelectListView}
				>
					<Icon name="List" width={20} height={20} />
				</div>
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
