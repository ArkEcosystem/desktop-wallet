import { ControlButton } from "app/components/ControlButton";
import { Icon } from "app/components/Icon";
import React from "react";

interface LayoutControlsProps {
	onSelectGridView: () => void;
	onSelectListView: () => void;
	selectedViewType: string;
}

export const LayoutControls = ({ onSelectGridView, onSelectListView, selectedViewType }: LayoutControlsProps) => (
	<div className="flex items-center space-x-1">
		<div data-testid="LayoutControls__list">
			<ControlButton
				data-testid="LayoutControls__list--icon"
				isActive={selectedViewType === "list"}
				onClick={onSelectListView}
			>
				<Icon name="ListView" width={20} height={20} />
			</ControlButton>
		</div>

		<div data-testid="LayoutControls__grid">
			<ControlButton
				data-testid="LayoutControls__grid--icon"
				isActive={selectedViewType === "grid"}
				onClick={onSelectGridView}
			>
				<Icon name="GridView" width={20} height={20} />
			</ControlButton>
		</div>
	</div>
);

LayoutControls.defaultProps = {
	selectedViewType: "grid",
};
