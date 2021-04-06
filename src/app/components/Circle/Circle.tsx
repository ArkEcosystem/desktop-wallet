import cn from "classnames";
import React from "react";
import { styled } from "twin.macro";
import { Size } from "types";

import { getStyles } from "./Circle.styles";

export type CircleProps = {
	as?: React.ElementType;
	children?: React.ReactNode;
	avatarId?: string;
	size?: Size;
	className?: string;
	shadowClassName?: string;
	noShadow?: boolean;
} & React.HTMLAttributes<any>;

const CircleWrapper = styled.div<CircleProps>(getStyles);

export const Circle = ({ className, noShadow, shadowClassName, size, children }: CircleProps) => (
	<CircleWrapper
		size={size}
		noShadow={!!noShadow}
		className={cn(className, shadowClassName || "ring-theme-background")}
	>
		{children}
	</CircleWrapper>
);

Circle.defaultProps = {
	noShadow: false,
};
