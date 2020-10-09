import { Icon } from "app/components/Icon";
import React from "react";

type LayoutControlsProps = {
	onSelectGridView: any;
	onSelectListView: any;
	selectedViewType: string;
};

//	<div className="absolute bottom-0 inset-x-0 h-2 bg-theme-danger-100 rounded hidden group-hover:block" />

export const LayoutControls = ({ onSelectGridView, onSelectListView, selectedViewType }: LayoutControlsProps) => {
	const getViewTypeIconClass = (viewType: any) =>
		selectedViewType === viewType
			? "text-theme-danger-300 border-theme-danger-contrast"
			: "text-theme-primary-400 border-transparent";

	return (
		<div className="flex items-center space-x-1">
			<div data-testid="LayoutControls__grid" className="inline-block">
				<div
					data-testid="LayoutControls__grid--icon"
					className={`py-2 px-3 h-full border-b-3 cursor-pointer hover:border-theme-danger-100 ${getViewTypeIconClass("grid")}`}
					onClick={onSelectGridView}
				>
					<Icon name="GridView" width={20} height={20} />
				</div>
			</div>

			<div data-testid="LayoutControls__list" className="inline-block">
				<div
					data-testid="LayoutControls__list--icon"
					className={`py-2 px-3 h-full border-b-3 cursor-pointer hover:border-theme-danger-100 ${getViewTypeIconClass("list")}`}
					onClick={onSelectListView}
				>
					<Icon name="ListView" width={20} height={20} />
				</div>
			</div>
		</div>
	);
};

LayoutControls.defaultProps = {
	selectedViewType: "grid",
};
