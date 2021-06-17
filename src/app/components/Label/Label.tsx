import { styled } from "twin.macro";
import { Size } from "types";

import { getStyles } from "./Label.styles";

interface LabelProperties {
	color?: "primary" | "success" | "danger" | "warning" | "neutral";
	size?: Size;
	variant?: "solid";
}

export const Label = styled.div<LabelProperties>(getStyles);

Label.defaultProps = {
	color: "primary",
};
