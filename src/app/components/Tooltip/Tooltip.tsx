import Tippy, { TippyProps } from "@tippyjs/react";
import { useTheme } from "app/hooks";
import React from "react";
import { Size } from "types";

import { getStyles } from "./Tooltip.styles";

export type TooltipProps = {
	size?: Size;
} & TippyProps;

export const Tooltip = ({ size, theme, ...properties }: TooltipProps) => {
	const themeOptions = useTheme();
	if (!properties.content) {
		return <>{properties.children}</>;
	}
	return <Tippy maxWidth={600} theme={theme || themeOptions.theme} {...properties} className={getStyles(size)} />;
};
