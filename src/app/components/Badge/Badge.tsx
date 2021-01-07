import { Icon } from "app/components/Icon";
import React, { forwardRef } from "react";
import { styled } from "twin.macro";
import { Position } from "types";

import { defaultClasses, getStyles } from "./Badge.styles";

type BadgeProps = {
	className?: string;
	children?: React.ReactNode;
	icon?: string;
	iconClass?: string;
	iconWidth?: number;
	iconHeight?: number;
	position?: Position;
};

export const Wrapper = styled.span<BadgeProps>(getStyles);

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({ className, children, icon, iconClass, iconWidth, iconHeight, position, ...props }: BadgeProps, ref) => (
		<Wrapper ref={ref} position={position} className={`${defaultClasses} ${className}`} {...props}>
			{!!icon && <Icon name={icon} className={iconClass} width={iconWidth} height={iconHeight} />}
			<span>{children}</span>
		</Wrapper>
	),
);

Badge.displayName = "Badge";

Badge.defaultProps = {
	iconWidth: 12,
	iconHeight: 12,
	position: "bottom-right",
};
