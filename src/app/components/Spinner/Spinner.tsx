import { styled } from "twin.macro";
import { Size } from "types";

import { getStyles } from "./Spinner.styles";

type Spinner = {
	color?: "primary" | "success" | "danger" | "warning";
	size?: Size;
};

export const Spinner = styled.div<Spinner>(getStyles);

Spinner.defaultProps = {
	color: "primary",
};
