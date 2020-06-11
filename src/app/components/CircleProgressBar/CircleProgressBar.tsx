import { styled } from "twin.macro";
import { getStyles } from "./style";

type CircleProgressBarProps = {
	as?: React.ElementType;
};

export const CircleProgressBar = styled.div<CircleProgressBarProps>(getStyles);

CircleProgressBar.defaultProps = {};
