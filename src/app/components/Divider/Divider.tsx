import { styled } from "twin.macro";

import { getStyles } from "./Divider.styles";

type DividerProps = {
	type?: "horizontal" | "vertical";
	size?: "sm" | "lg";
	dashed?: boolean;
	className?: string;
};

export const Divider = styled.div<DividerProps>(getStyles);

Divider.defaultProps = {
	type: "horizontal",
	className: "border-theme-secondary-300 dark:border-theme-secondary-800",
};
