import { styled } from "twin.macro";
import { getStyles } from "./style";

type LabelProps = {
	color?: "primary" | "success" | "danger" | "warning" | "neutral";
	size?: "small" | "default" | "large" | "icon";
};

export const Label = styled.div<LabelProps>(getStyles);

Label.defaultProps = {
	color: "primary",
	size: "default",
};
