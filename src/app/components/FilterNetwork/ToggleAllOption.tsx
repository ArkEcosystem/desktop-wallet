import { Badge } from "app/components/Badge";
import { Circle } from "app/components/Circle";
import React from "react";

import { ToggleAllOptionProps } from "./";

export const ToggleAllOption = ({ onClick, isHidden = false, isSelected = false }: ToggleAllOptionProps) => {
	if (isHidden) return <></>;

	return (
		<Circle
			size="lg"
			data-testid="network__viewall"
			className="relative cursor-pointer border-theme-primary-contrast mr-5"
			onClick={onClick}
		>
			<div className="text-sm font-semibold text-theme-primary-500">All</div>
			{isSelected && (
				<Badge
					className="bg-theme-primary-600 border-theme-primary-600 text-theme-primary-contrast"
					icon="ChevronUp"
					iconWidth={10}
					iconHeight={10}
				/>
			)}
			{!isSelected && (
				<Badge
					className="border-theme-primary-contrast text-theme-primary-500"
					icon="ChevronDown"
					iconWidth={10}
					iconHeight={10}
				/>
			)}
		</Circle>
	);
};
