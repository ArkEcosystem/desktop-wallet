import { Icon } from "app/components/Icon";
import React from "react";
import tw, { css, styled } from "twin.macro";

type LayoutControlsProps = {
	onSelectGridView: any;
	onSelectListView: any;
	selectedViewType: string;
};

export const ControlButton = styled.div<{ isActive?: boolean }>`
	${tw`transition-colors duration-200 relative py-2 px-3 h-full cursor-pointer`}

	&:after {
		${tw`transition-opacity duration-200 absolute inset-x-0 bg-theme-danger-contrast dark:bg-theme-danger-700 rounded opacity-0 group-hover:opacity-100`}
		content: "";
		height: 3px;
		bottom: -3px;
	}

	${({ isActive }) =>
		isActive
			? [
					tw`text-theme-danger-400`,
					css`
						&:after {
							opacity: 100;
						}
					`,
			  ]
			: tw`text-theme-primary-300 dark:text-theme-neutral-600 hover:text-theme-danger-400`};
`;

export const LayoutControls = ({ onSelectGridView, onSelectListView, selectedViewType }: LayoutControlsProps) => (
	<div className="flex items-center space-x-1">
		<div data-testid="LayoutControls__grid" className="group">
			<ControlButton
				data-testid="LayoutControls__grid--icon"
				isActive={selectedViewType === "grid"}
				onClick={onSelectGridView}
			>
				<Icon name="GridView" width={20} height={20} />
			</ControlButton>
		</div>

		<div data-testid="LayoutControls__list" className="group">
			<ControlButton
				data-testid="LayoutControls__list--icon"
				isActive={selectedViewType === "list"}
				onClick={onSelectListView}
			>
				<Icon name="ListView" width={20} height={20} />
			</ControlButton>
		</div>
	</div>
);

LayoutControls.defaultProps = {
	selectedViewType: "grid",
};
