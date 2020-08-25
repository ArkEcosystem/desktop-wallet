import { styled } from "twin.macro";
import { Size } from "types";

import { getStyles } from "./Circle.styles";

export type CircleProps = {
	as?: React.ElementType;
	children?: React.ReactNode;
	avatarId?: string | null;
	size?: Size;
	className?: string | null;
	noShadow?: boolean;
	shadowColor?: string;
};

export const Circle = styled.div<CircleProps>(getStyles);

Circle.defaultProps = {
	noShadow: false,
};
