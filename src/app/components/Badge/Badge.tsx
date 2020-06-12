import React from "react";
import { styled, css } from "twin.macro";

import { Icon } from "app/components/Icon";
import { defaultStyle, defaultClasses } from "./style";

type BadgeProps = {
	className?: string;
	children?: React.ReactNode;
	icon?: string;
	iconWidth?: number;
	iconHeight?: number;
};

export const Wrapper = styled.span`
	${defaultStyle}
`;

export const Badge = ({ className, children, icon, iconWidth, iconHeight }: BadgeProps) => {
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
