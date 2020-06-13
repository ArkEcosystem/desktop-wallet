import { styled } from "twin.macro";
import { getStyles } from "./Circle.styles";

type CircleProps = {
	as?: React.ElementType;
	children?: React.ReactNode;
	avatarId?: string | null;
	size?: "small" | "default";
	className?: string | null;
	noShadow?: boolean;
};

export const Circle = styled.div<CircleProps>(getStyles);

Circle.defaultProps = {
	size: "default",
	noShadow: false,
};
