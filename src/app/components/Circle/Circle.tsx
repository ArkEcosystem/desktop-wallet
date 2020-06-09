import { styled } from "twin.macro";
import { getStyles } from "./style";

type CircleProps = {
	as?: React.ElementType;
	children?: React.ReactNode;
	avatarId: string | null;
	size: string | null;
	className: string | null;
} & React.ButtonHTMLAttributes<any>;

export const Circle = styled.div<CircleProps>(getStyles);

Circle.defaultProps = {
	size: "default",
};
