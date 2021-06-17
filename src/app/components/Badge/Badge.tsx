import { Icon } from "app/components/Icon";
import React, { forwardRef } from "react";
import { styled } from "twin.macro";
import { Position, Size } from "types";

import { defaultClasses, getStyles, StylesType } from "./Badge.styles";

interface BadgeProperties {
	className?: string;
	children?: React.ReactNode;
	icon?: string;
	iconClass?: string;
	iconWidth?: number;
	iconHeight?: number;
	size?: Size;
	position?: Position;
	noShadow?: boolean;
}

export const Wrapper = styled.span<StylesType>(getStyles);

export const Badge = forwardRef<HTMLSpanElement, BadgeProperties>(
	({ className, children, icon, iconClass, iconWidth, iconHeight, ...properties }: BadgeProperties, reference) => (
		<Wrapper ref={reference} className={`${defaultClasses} ${className}`} {...properties}>
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
