import { Icon } from "app/components/Icon";
import React from "react";
import { styled } from "twin.macro";

import { defaultClasses, getStyles } from "./Badge.styles";

type BadgeProps = {
	className?: string;
	children?: React.ReactNode;
	icon?: string;
	iconWidth?: number;
	iconHeight?: number;
	position?: "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "left" | "top-left";
};

export const Wrapper = styled.span<BadgeProps>(getStyles);

export const Badge = ({ className, children, icon, iconWidth, iconHeight, position }: BadgeProps) => (
	<Wrapper position={position} className={`${defaultClasses} ${className}`}>
		{!!icon && <Icon name={icon} width={iconWidth} height={iconHeight} />}
		<span>{children}</span>
	</Wrapper>
);

Badge.defaultProps = {
	iconWidth: 12,
	iconHeight: 12,
	position: "bottom-right",
};
