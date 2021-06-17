import cn from "classnames";
import React, { forwardRef } from "react";
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

export const Circle = forwardRef<HTMLDivElement, CircleProps>(
	({ className, noShadow, shadowClassName, size, children, ...properties }: CircleProps, reference) => (
		<CircleWrapper
			ref={reference}
			size={size}
			noShadow={!!noShadow}
			className={cn(className, shadowClassName || "ring-theme-background")}
			{...properties}
		>
			{children}
		</CircleWrapper>
	),
);

Circle.displayName = "Circle";

Circle.defaultProps = {
	noShadow: false,
};
