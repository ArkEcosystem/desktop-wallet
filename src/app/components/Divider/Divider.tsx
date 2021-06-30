import { styled } from "twin.macro";

import { getStyles } from "./Divider.styles";

interface DividerProperties {
	type?: "horizontal" | "vertical";
	size?: "sm" | "lg";
	dashed?: boolean;
	className?: string;
}

export const Divider = styled.div<DividerProperties>(getStyles);

Divider.defaultProps = {
	className: "border-theme-secondary-300 dark:border-theme-secondary-800",
	type: "horizontal",
};
