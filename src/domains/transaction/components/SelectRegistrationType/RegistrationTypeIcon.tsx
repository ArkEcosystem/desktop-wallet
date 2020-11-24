import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { Size } from "types";

type Props = {
	displayName?: string;
	iconName: string;
	as?: React.ElementType;
	size?: Size;
	iconSize?: number;
	showTooltip?: boolean;
	noShadow?: boolean;
	shadowColor?: string;
};

export const RegistrationTypeIcon = ({ displayName, iconName, iconSize, showTooltip, ...props }: Props) => (
	<Tooltip content={displayName} disabled={!showTooltip || !displayName}>
		<Circle
			aria-label={displayName}
			data-testid={`RegistrationTypeIcon-${iconName}`}
			className="text-theme-primary-300 hover:text-theme-primary border-theme-primary-100 hover:bg-theme-primary-100"
			{...props}
		>
			<Icon data-testid="RegistrationTypeIcon__icon" name={iconName} width={iconSize} height={iconSize} />
		</Circle>
	</Tooltip>
);

RegistrationTypeIcon.defaultProps = {
	showTooltip: true,
	iconSize: 20,
};
