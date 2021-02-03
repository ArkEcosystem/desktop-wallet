import { styled } from "twin.macro";
import { Color, Size } from "types";

import { getStyles } from "./Spinner.styles";

type Spinner = {
	color?: Color;
	size?: Size;
};

export const Spinner = styled.div<Spinner>(getStyles);

Spinner.defaultProps = {
	color: "info",
};
