import { styled } from "twin.macro";
import { Size } from "types";

import { getStyles } from "./Label.styles";

type LabelProps = {
	color?: "primary" | "success" | "danger" | "warning" | "neutral";
	size?: Size;
	variant?: "solid";
};

export const Label = styled.div<LabelProps>(getStyles);

Label.defaultProps = {
	color: "primary",
};
