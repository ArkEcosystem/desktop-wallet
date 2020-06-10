import React from "react";
import { Icon } from "../Icon";
import { Wrapper, defaultClasses } from "./style";

type BadgeProps = {
	className?: string;
	children?: React.ReactNode;
	icon?: string;
	iconWidth?: number;
	iconHeight?: number;
};

export const Badge = ({ className, children, icon, iconWidth, iconHeight, iconColor }: BadgeProps) => {
	return (
		<Wrapper className={`${defaultClasses} ${className}`}>
			{!!icon && <Icon name={icon} width={iconWidth} height={iconHeight}></Icon>}
			<span>{children}</span>
		</Wrapper>
	);
};

Badge.defaultProps = {
	iconWidth: 12,
	iconHeight: 12,
};
