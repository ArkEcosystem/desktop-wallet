import { Icon } from "app/components/Icon";
import React from "react";

type LayoutControlsProps = {
	onSelectGridView: any;
	onSelectListView: any;
	selectedViewType: string;
};

export const LayoutControls = ({ onSelectGridView, onSelectListView, selectedViewType }: LayoutControlsProps) => {
	const getViewTypeIconClass = (viewType: any) => {
		return selectedViewType === viewType
			? "text-theme-danger-300 border-theme-danger-contrast"
			: "text-theme-primary-400 border-theme-background";
	};

	return (
		<>
			<div data-testid="LayoutControls__grid" className="inline-block">
				<div
					data-testid="LayoutControls__grid--icon"
					className={`px-3 py-3 h-full border-b-3 cursor-pointer ${getViewTypeIconClass("grid")}`}
					onClick={onSelectGridView}
				>
					<Icon name="Grid" width={28} height={14} />
				</div>
			</div>

			<div data-testid="LayoutControls__list" className="inline-block">
				<div
					data-testid="LayoutControls__list--icon"
					className={`px-3 py-3 h-full border-b-3 cursor-pointer ${getViewTypeIconClass("list")}`}
					onClick={onSelectListView}
				>
					<Icon name="List" width={24} height={14} />
				</div>
			</div>
		</>
	);
};

LayoutControls.defaultProps = {
	selectedViewType: "grid",
};
